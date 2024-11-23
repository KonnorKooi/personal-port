name: Deploy to Apache Server

on:
  push:
    branches:
      - main  # or master, depending on your default branch name

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install Dependencies
      run: npm install
        
    - name: Build Next.js App
      run: npm run build
        
    - name: Deploy to Apache Server
      uses: easingthemes/ssh-deploy@v4.1.8
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        ARGS: "-rlgoDzvc -i"
        SOURCE: ".next/"  # Source directory
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: "/var/www/konnorkooi.com/_next"  # Remote directory
        EXCLUDE: "/dist/, /node_modules/, /.git/, /.github/"
        
    - name: Copy Static Files
      uses: easingthemes/ssh-deploy@v4.1.8
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        ARGS: "-rlgoDzvc -i"
        SOURCE: "public/"  # Source directory for static files
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: "/var/www/konnorkooi.com/"  # Remote directory
        EXCLUDE: "/dist/, /node_modules/, /.git/, /.github/"