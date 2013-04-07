1. Extract access log from splunk
Search splunk with query "dest_host=stageb-mobile.whitepages.com.au"

2. Import splunk csv export into mongodb
e.g. cat ~/Downloads/stageb-201303221805-201303222111.csv | mongoimport   --headerline --type csv  -d wp_access_log -c prod

3. Start mongo client with util.js preloaded.
mongo --shell wp_access_log mapreduce/util.js

4. Apply Map Reduce to generate output for each of the chart type. You may have to replace the hostname in the script
   with whatever environment you are working on.

5. Replace the data in <chart_type>.html in html directory.

6. Export contents of html directory.