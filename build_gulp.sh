npm install --production &>/dev/null
NODE_ENV=production node_modules/.bin/gulp build &>/dev/null
npm cache clean &>/dev/null
echo "Done."
