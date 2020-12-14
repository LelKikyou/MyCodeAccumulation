WEB_PATH='./video_booking_system'

echo "Start deployment"
cd $WEB_PATH
echo "pulling source code..."
git pull
echo "changing permissions..."
npm install
npm run serverBuild
echo "build end"
echo "Finished."