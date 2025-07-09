#!/bin/bash
# This script will upload your project code to GitHub.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting GitHub Upload ---"

# 1. Initialize Git repository and set the main branch
# (If it's already initialized, this won't cause any problems)
if [ ! -d ".git" ]; then
  echo "Initializing new Git repository..."
  git init -b main
else
  echo "Git repository already initialized."
fi

# 2. Add the remote repository (if not already added)
if ! git remote get-url origin > /dev/null 2>&1; then
  echo "Adding GitHub remote..."
  git remote add origin https://github.com/OfferFlowApp/offerflow-app.git
else
  echo "GitHub remote already configured."
fi

# 3. Add all files for the first commit
echo "Adding all project files..."
git add .

# 4. Commit the files with a message
echo "Creating a snapshot (commit) of your files..."
# The '|| true' part prevents the script from failing if there are no changes to commit
git commit -m "Initial upload of OfferFlow project" || true

# 5. Push the code to the 'main' branch on GitHub
echo "Uploading files to GitHub..."
git push -u origin main

echo ""
echo "--- SUCCESS! ---"
echo "Your files have been uploaded to GitHub."
echo "You can now go back to the Firebase setup page, refresh it, and select the 'main' branch."
