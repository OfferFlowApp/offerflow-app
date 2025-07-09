
# Simple Deployment Guide: Getting Your App Live

This guide will walk you through the final steps to get your app online. We will get your code onto GitHub so Firebase can host it for you.

---

### **Part 1: Upload Your Code to GitHub**

Right now, your new GitHub repository is empty. We need to upload your project files to it. The easiest way to do this is using GitHub's website directly.

1.  **Open Your Repository**: [Click here to open your `offerflow-app` GitHub repository.](https://github.com/OfferFlowApp/offerflow-app)

2.  **Add Files**: In your repository, click the **"Add file"** button and then choose **"Upload files"** from the dropdown menu.

    

3.  **Select Your Project Files**:
    *   A file explorer window will open on your computer, showing the files for this project.
    *   **IMPORTANT**: Select **ALL** the files and folders for your project and drag them into the GitHub upload box. This includes files like `package.json`, `next.config.js`, and folders like `src` and `public`.

4.  **Commit (Save) the Files**:
    *   Wait for all the files to finish uploading.
    *   At the bottom of the page, you'll see a box that says "Commit changes".
    *   Type a simple message like `Initial Upload`.
    *   Make sure the option **"Commit directly to the `main` branch"** is selected.
    *   Click the green **"Commit changes"** button.

    

Your code is now on GitHub! The `main` branch has been created automatically.

---

### **Part 2: Connect Firebase to GitHub**

Now we can go back to Firebase and finish the setup.

1.  **Go back to the Firebase "Set up App Hosting" page** (the one from your last screenshot).

2.  **Refresh the page.**

3.  Under **"Deployment settings"**:
    *   For **"Live branch"**, you should now be able to select **`main`** from the dropdown menu. The error message will disappear.
    *   Leave the **"Root directory"** field **empty**.

4.  Click **"Finish setup"**.

---

That's it! Firebase will now automatically deploy your application from the `main` branch of your GitHub repository. After a few minutes, it will give you your public live URL. You can then use that URL to finish setting up your Stripe webhook.
