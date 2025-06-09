
"use client";

import type { OfferSheetData, Product, SellerInfo, CustomerInfo, Currency } from '@/lib/types';
import Image from 'next/image';
import type { FC } from 'react';

interface PdfPageLayoutProps {
  offerData: OfferSheetData;
  productsOnPage: Product[];
  pageNum: number;
  totalPages: number;
  currencySymbol: string;
  calculatedTotals: {
    totalOriginalPrice: number;
    subtotalDiscounted: number;
    vatAmount: number;
    grandTotal: number;
  };
  creationDate: string;
}

const PdfPageLayout: FC<PdfPageLayoutProps> = ({
  offerData,
  productsOnPage,
  pageNum,
  totalPages,
  currencySymbol,
  calculatedTotals,
  creationDate,
}) => {
  const { customerInfo, sellerInfo, validityStartDate, validityEndDate, termsAndConditions } = offerData;

  return (
    <div
      className="bg-white text-black p-6 font-['Roboto']"
      style={{ width: '210mm', minHeight: '297mm', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <header className="flex justify-between items-start pb-4 border-b border-gray-300">
        <div className="w-2/5">
          <Image src="/offerflow-logo.png" alt="OfferFlow" width={150} height={36} className="mb-2" data-ai-hint="app logo"/>
          <p className="text-xs italic mb-3">Work Faster-Sell Smarter</p>
          {sellerInfo.logoUrl && (
            <Image src={sellerInfo.logoUrl} alt="Seller Logo" width={100} height={50} className="max-h-16 object-contain mb-2 border p-1" data-ai-hint="company logo"/>
          )}
           <div className="text-xs mt-1">
            <p className="font-bold">{sellerInfo.name || 'Your Company Name'}</p>
            <p>{sellerInfo.address || '123 Seller St, City'}</p>
            <p>{sellerInfo.contact || 'seller@example.com'}</p>
          </div>
        </div>

        <div className="w-2/5 text-xs">
          <h2 className="font-bold mb-1 text-sm">Client Information</h2>
          <p><span className="font-semibold">Name:</span> {customerInfo.name}</p>
          <p><span className="font-semibold">Company:</span> {customerInfo.company}</p>
          <p><span className="font-semibold">VAT Number:</span> {customerInfo.vatNumber}</p>
          <p><span className="font-semibold">Email:</span> {customerInfo.contact}</p>
          {/* <p><span className="font-semibold">Phone:</span> {customerInfo.phone}</p> Assuming contact field is email/main phone */}
          {customerInfo.phone2 && <p><span className="font-semibold">Phone 2:</span> {customerInfo.phone2}</p>}
          <p><span className="font-semibold">Address:</span> {customerInfo.address}</p>
        </div>

        <div className="w-1/5 text-xs text-right">
          <p className="font-bold text-sm mb-2">Page {pageNum}/{totalPages}</p>
          <p>Date: {creationDate}</p>
          {validityStartDate && <p>Valid From: {new Date(validityStartDate).toLocaleDateString()}</p>}
          {validityEndDate && <p>Valid Until: {new Date(validityEndDate).toLocaleDateString()}</p>}
        </div>
      </header>

      {/* Products */}
      <main className="flex-grow py-4">
        {productsOnPage.map((product) => (
          <div key={product.id} className="flex mb-3 pb-3 border-b border-gray-200 last:border-b-0">
            <div className="w-1/4 pr-3">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.title} width={100} height={100} className="w-full h-auto object-contain max-h-28 border" data-ai-hint="product image" />
              ) : (
                <div className="w-full h-28 border flex items-center justify-center text-gray-400 text-xs bg-gray-50">
                  No Image
                </div>
              )}
            </div>
            <div className="w-3/4">
              <h3 className="font-bold text-base mb-1">{product.title}</h3>
              <p className="text-xs mb-2 whitespace-pre-line">{product.description}</p>
              <div className="grid grid-cols-3 text-xs items-center">
                <span>Qty: {product.quantity}</span>
                <span>Price/Unit: {currencySymbol}{product.discountedPrice.toFixed(2)}</span>
                <span className="font-bold text-right">Total: {currencySymbol}{(product.quantity * product.discountedPrice).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Footer - Only on last page */}
      {pageNum === totalPages && (
        <footer className="pt-4 border-t border-gray-300 text-xs mt-auto">
          <div className="flex justify-between">
            <div className="w-3/5 pr-2">
              <h4 className="font-bold mb-1 text-sm">Comments / Terms & Conditions:</h4>
              <p className="whitespace-pre-line">{termsAndConditions}</p>
            </div>
            <div className="w-2/5 text-right">
              <p>Original Total Price: {currencySymbol}{calculatedTotals.totalOriginalPrice.toFixed(2)}</p>
              <p className="font-bold text-sm">Discounted Total Price (excl. VAT): {currencySymbol}{calculatedTotals.subtotalDiscounted.toFixed(2)}</p>
              {offerData.vatRate !== undefined && offerData.vatRate > 0 && (
                <>
                  <p>VAT ({offerData.vatRate}%): {currencySymbol}{calculatedTotals.vatAmount.toFixed(2)}</p>
                  <p className="font-bold text-base">Grand Total (incl. VAT): {currencySymbol}{calculatedTotals.grandTotal.toFixed(2)}</p>
                </>
              )}
            </div>
          </div>
        </footer>
      )}
       {/* Ensure content pushes footer down if page is not full, but only if it's not the last page potentially */}
       {pageNum !== totalPages && <div style={{ flexGrow: 1 }}></div>}
    </div>
  );
};

export default PdfPageLayout;
