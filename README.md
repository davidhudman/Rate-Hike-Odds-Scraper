# Fed Rate Hike Odds Scraper #

*This is designed to scrape the current chances of a Federal Reserve rate hike from CME http://cme-fedwatch-prod.aws.barchart.com/static/index.html*


command to run in command prompt:

`node --harmony index.js`

The reason that you need --harmony is because of incompatibility with the async and wait functions. Don't totally understand it, but I know you need it.