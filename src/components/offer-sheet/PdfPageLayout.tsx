
"use client";

import React from 'react';
import type { OfferSheetData, Product, Language } from '@/lib/types';
import Image from 'next/image';

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
  t: (translations: { [key in Language]?: string } | string, fallback?: string) => string;
}

const PdfPageLayout: React.FC<PdfPageLayoutProps> = ({
  offerData,
  productsOnPage,
  pageNum,
  totalPages,
  currencySymbol,
  calculatedTotals,
  creationDate,
  t,
}) => {
  const { 
    customerInfo, 
    sellerInfo, 
    validityStartDate, 
    validityEndDate, 
    termsAndConditions, 
    vatRate 
  } = offerData;

  return (
    <div
      className="bg-white text-black p-6 font-body"
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        display: 'flex', 
        flexDirection: 'column', 
        fontFamily: 'Roboto, sans-serif' 
      }}
    >
      {/* Header */}
      <header className="flex justify-between items-start pb-4 border-b border-gray-300">
        <div className="w-2/5">
          {sellerInfo.logoUrl ? (
             <Image 
               src={sellerInfo.logoUrl} 
               alt={t({en: "Seller Logo", el: "Λογότυπο Πωλητή"})} 
               width={120} 
               height={60} 
               className="max-h-20 object-contain mb-2"
               data-ai-hint="company logo"
             />
          ) : (
            <div className="h-16 w-32 bg-gray-100 flex items-center justify-center text-xs text-gray-500 mb-2 rounded">
                {t({en: "No Logo", el: "Χωρίς Λογότυπο"})}
            </div>
          )}
           <div className="text-xs mt-1">
            <p className="font-bold text-sm">{sellerInfo.name || t({en: 'Your Company Name', el: 'Όνομα Εταιρείας'})}</p>
            <p className="whitespace-pre-line">{sellerInfo.address || t({en: '123 Seller St, City', el: 'Οδός Πωλητή 123, Πόλη'})}</p>
            {sellerInfo.email && <p>{sellerInfo.email}</p>}
            {sellerInfo.phone && <p>{sellerInfo.phone}</p>}
            {sellerInfo.gemhNumber && <p>{t({en: 'GEMH No.:', el: 'Γ.Ε.ΜΗ.:'})} {sellerInfo.gemhNumber}</p>}
          </div>
        </div>

        <div className="w-2/5 text-xs pl-2">
          <h2 className="font-bold mb-1 text-sm">{t({en: "Client Information", el: "Στοιχεία Πελάτη"})}</h2>
          <p><span className="font-semibold">{t({en: "Name:", el: "Όνομα:"})}</span> {customerInfo.name}</p>
          {customerInfo.company && <p><span className="font-semibold">{t({en: "Company:", el: "Εταιρεία:"})}</span> {customerInfo.company}</p>}
          {customerInfo.vatNumber && <p><span className="font-semibold">{t({en: "VAT No.:", el: "ΑΦΜ:"})}</span> {customerInfo.vatNumber}</p>}
          {customerInfo.gemhNumber && <p><span className="font-semibold">{t({en: "GEMH No.:", el: "Γ.Ε.ΜΗ.:'})}</span> {customerInfo.gemhNumber}</p>}
          {customerInfo.contact && <p><span className="font-semibold">{t({en: "Email/Contact:", el: "Email/Επικοινωνία:"})}</span> {customerInfo.contact}</p>}
          {customerInfo.phone2 && <p><span className="font-semibold">{t({en: "Phone:", el: "Τηλέφωνο:"})}</span> {customerInfo.phone2}</p>}
          {customerInfo.address && <p className="whitespace-pre-line"><span className="font-semibold">{t({en: "Address:", el: "Διεύθυνση:"})}</span> {customerInfo.address}</p>}
        </div>

        <div className="w-1/5 text-xs text-right">
          <h1 className="font-bold text-lg mb-2 uppercase">{t({en: "Offer", el: "Προσφορά"})}</h1>
          <p>{t({en: "Date:", el: "Ημερομηνία:"})} {creationDate}</p>
          {validityStartDate && <p>{t({en: "Valid From:", el: "Ισχύει από:"})} {new Date(validityStartDate).toLocaleDateString(t({en: 'en-US', el: 'el-GR'}) as string)}</p>}
          {validityEndDate && <p>{t({en: "Valid Until:", el: "Ισχύει έως:"})} {new Date(validityEndDate).toLocaleDateString(t({en: 'en-US', el: 'el-GR'}) as string)}</p>}
           <p className="font-semibold mt-2">{t({en: "Page", el: "Σελίδα"})} {pageNum} / {totalPages}</p>
        </div>
      </header>

      {/* Products Table */}
      <main className="flex-grow py-4">
        <table className="w-full border-collapse text-xs">
            <thead>
                <tr className="border-b border-gray-400">
                    <th className="w-1/6 text-left font-bold p-1">{t({en: "Image", el: "Εικόνα"})}</th>
                    <th className="w-2/6 text-left font-bold p-1">{t({en: "Product / Description", el: "Προϊόν / Περιγραφή"})}</th>
                    <th className="w-1/12 text-center font-bold p-1">{t({en: "Qty", el: "Ποσ."})}</th>
                    <th className="w-1/6 text-right font-bold p-1">{t({en: "Unit Price", el: "Τιμή Μον."})} ({currencySymbol})</th>
                    <th className="w-1/6 text-right font-bold p-1">{t({en: "Total Price", el: "Συνολ. Τιμή"})} ({currencySymbol})</th>
                </tr>
            </thead>
            <tbody>
                {productsOnPage.map((product) => {
                    const unitPriceToDisplay = product.discountedPriceType === 'inclusive' && vatRate && vatRate > 0
                        ? product.discountedPrice / (1 + vatRate / 100)
                        : product.discountedPrice;
                    const lineTotal = (product.quantity || 1) * unitPriceToDisplay;

                    return (
                        <tr key={product.id} className="border-b border-gray-200 align-top">
                            <td className="p-1">
                                {product.imageUrl ? (
                                <Image 
                                  src={product.imageUrl} 
                                  alt={product.title} 
                                  width={80} 
                                  height={80} 
                                  className="w-full h-auto object-contain max-h-20 border" 
                                  data-ai-hint="product image"
                                />
                                ) : (
                                <div className="w-full h-20 border flex items-center justify-center text-gray-400 text-xs bg-gray-50">
                                    {t({en: "No Image", el: "Χωρίς Εικόνα"})}
                                </div>
                                )}
                            </td>
                            <td className="p-1">
                                <h3 className="font-bold text-sm mb-0.5">{product.title}</h3>
                                <p className="text-xs whitespace-pre-line">{product.description}</p>
                            </td>
                            <td className="text-center p-1">{product.quantity}</td>
                            <td className="text-right p-1">{unitPriceToDisplay.toFixed(2)}</td>
                            <td className="text-right p-1 font-semibold">{lineTotal.toFixed(2)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </main>

      {/* Footer - Only on last page */}
      {pageNum === totalPages && (
        <footer className="pt-4 border-t border-gray-300 text-xs mt-auto">
          <div className="flex justify-between">
            <div className="w-3/5 pr-4">
              <h4 className="font-bold mb-1 text-sm">{t({en: "Comments / Terms & Conditions:", el: "Σχόλια / Όροι & Προϋποθέσεις:"})}</h4>
              <p className="whitespace-pre-line text-xs">{termsAndConditions}</p>
            </div>
            <div className="w-2/5 text-right text-xs">
              <p>{t({en: "Total Original (Excl. VAT):", el: "Συνολική Αρχική (Εκτός ΦΠΑ):"})} <span className="font-semibold">{currencySymbol}{calculatedTotals.totalOriginalPrice.toFixed(2)}</span></p>
              <p className="font-bold">{t({en: "Subtotal (Excl. VAT):", el: "Μερικό Σύνολο (Εκτός ΦΠΑ):"})} <span className="font-semibold">{currencySymbol}{calculatedTotals.subtotalDiscounted.toFixed(2)}</span></p>
              {vatRate !== undefined && vatRate > 0 && (
                <>
                  <p>{t({en: "VAT", el: "ΦΠΑ"})} ({vatRate}%): <span className="font-semibold">{currencySymbol}{calculatedTotals.vatAmount.toFixed(2)}</span></p>
                  <p className="font-bold text-sm mt-1">{t({en: "Grand Total (Incl. VAT):", el: "Γενικό Σύνολο (Με ΦΠΑ):"})} <span className="font-semibold">{currencySymbol}{calculatedTotals.grandTotal.toFixed(2)}</span></p>
                </>
              )}
               {(vatRate === undefined || vatRate === 0) && (
                 <p className="font-bold text-sm mt-1">{t({en: "Grand Total:", el: "Γενικό Σύνολο:"})} <span className="font-semibold">{currencySymbol}{calculatedTotals.grandTotal.toFixed(2)}</span></p>
               )}
            </div>
          </div>
           <div className="text-center mt-6 text-gray-500 text-[10px]">
             {t({en: "Thank you for your business!", el: "Ευχαριστούμε για την προτίμησή σας!"})}
          </div>
        </footer>
      )}
       {pageNum !== totalPages && <div style={{ flexGrow: 1 }}></div>}
    </div>
  );
};

export default PdfPageLayout;
