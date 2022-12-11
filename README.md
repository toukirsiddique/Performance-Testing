
## Project Title
Performance Testing (Load Testing) on "Blazedemo" a flight booking test site.

Link of the site: https://blazedemo.com/
## Project Report Link
Link: https://blazedemo-loadtesting.netlify.app/

This particulat link is for Thread group 400. 
Other thread group's such as 100, 200, 300 and 600 reports could be found in the added "html" files in the git repo.
## Generated Result Report

Dear concerned,

I have concluded performance test on frequently used API for Blazedemo web application.
Test performed for the below mentioned scenario in server https://blazedemo.com/

100 Concurrent Request with 1 Loop Count; Avg TPS for Total Sample is ~ 29 And Total Concurrent API requested: 5600.

200 Concurrent Request with 1 Loop Count; Avg TPS for Total Sample is ~ 44 And Total Concurrent API requested: 7600.

300 Concurrent Request with 1 Loop Count; Avg TPS for Total Sample is ~ 73 And Total Concurrent API requested: 8400.

400 Concurrent Request with 1 Loop Count; Avg TPS for Total Sample is ~ 104 And Total Concurrent API requested: 11110.

600 Concurrent Request with 1 Loop Count; Avg TPS for Total Sample is ~ 150 And Total Concurrent API requested: 15402.



While executed 600 concurrent request, found 13200 request got connection timeout and error rate is 8.3%

Summary: Server can handle almost concurrent 340 API call with almost zero (0) error rate.

I have attached the full report, please let me know if further query is needed.
## Technology
For this Load Testing Apache Jmeter and Blazemeter was used. 


## View html Reports 
Open the desired html file in the git repo and click html file to see the detailed generated html report.