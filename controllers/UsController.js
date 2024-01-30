import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer";
import * as https from "https";


const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const scrapData = async (req, res) => {

    try {
        const url = req.query.url || "https://palmbeach.realforeclose.com/index.cfm?zaction=USER&zmethod=CALENDAR";
        console.log('Crowl '+ url);
    
        const { data } = await axios.get(url, { httpsAgent });
        const $ = cheerio.load(data);

        const listItems = $(".CALDAYBOX .CALBOX.CALW5");
        let dataObj = [];
        


        listItems.each((idx, el) => {

          // var item_html = $(el).html();
          // console.log(item_html);


         
          const itemData = {date_of_auction: "", day_of_auction_date_format: "", count_of_active_auction: "", count_of_total_auction: ""};


          itemData.date_of_auction = $(el).attr('aria-label');
          itemData.day_of_auction_date_format =  $(el).attr('aria-label');
          itemData.count_of_active_auction = $(el).find('.CALTEXT .CALACT').text().replace('\n', '').replace(' ', '');
          itemData.count_of_total_auction = $(el).find('.CALTEXT .CALSCH').text().replace('\n', '').replace(' ', '');



          // itemData.answer = $(el).find('p button').attr('data-answer');
          if(itemData.count_of_active_auction){
            dataObj.push(itemData);
          }
          
        });
    
    
        // return dataObj;
        res.send(dataObj);
    
      } catch (err) {
        res.send({
            'err':err
        });
      }

    
}





const scrapData3 = async (req, res) => {

  try {
      const url = req.query.url || "https://www.pbcgov.org/papa/Asps/PropertyDetail/PropertyDetail.aspx?parcel=" + req.query.parcel_id;
      console.log('Crowl '+ url);
  
      const { data } = await axios.get(url, { httpsAgent });
      const $ = cheerio.load(data);


      console.log('API 3', $('#propertyDetailDiv'));

      const propertyDetailDiv = $('#propertyDetailDiv');
      const ownerInformationDiv = $('#ownerInformationDiv');
      const salesInformationDiv = $("#salesInformationDiv");
      const exemptionInformationDiv = $("#exemptionInformationDiv");
      const propertyInformationDiv = $("#propertyInformationDiv");
      const appraisalsDiv = $("#appraisalsDiv");
      const assessedValuesDiv = $("#assessedValuesDiv");
      const taxesDiv = $("#taxesDiv");
      // let dataObj = [];




      const itemData = {count_of_total_auction: "",count_of_active_auction: "",day_of_auction_date_format: "",date_of_auction: "",auction_type: "",case_number: "",final_judgment_amount: "",parcel_id: "",property_address: "",adlbl: "",plaintiff_max_bid: "",no_r_or_w_cases: "",location_address: "",municipality: "",parcel_control_number: "",subdivision: "",official_records_bookpage: "",sale_date: "",legal_description: "",owner_information: "",mailing_address: "",exception_info: "",sales_date: "",price: "",or_bookpage: "",sale_type: "",owner: "",no_sales_information: "",improvement_value: "",land_value: "",total_market_value: "",assessed_value: "",exemption_amount: "",taxable_value: "",ad_valorem: "",non_ad_valorem: "",total_tax: ""}


      itemData.location_address = $(propertyDetailDiv).find('#MainContent_lblLocation').text().replace('\n', '');
      itemData.municipality = $(propertyDetailDiv).find('#MainContent_lblMunicipality').text().replace('\n', '');
      itemData.parcel_control_number = $(propertyDetailDiv).find('#MainContent_lblPCN').text().replace('\n', '');
      itemData.subdivision = $(propertyDetailDiv).find('#MainContent_lblSubdiv').text().replace('\n', '');
      itemData.official_records_bookpage = $(propertyDetailDiv).find('#MainContent_lblBook').text().replace('\n', '') + '/'+$(propertyDetailDiv).find('#MainContent_lblPage').text().replace('\n', '');
      itemData.sale_date = $(propertyDetailDiv).find('#MainContent_lblSaleDate').text().replace('\n', '');
      itemData.legal_description = $(propertyDetailDiv).find('#MainContent_lblLegalDesc').text().replace('\n', '').replace(' ', '').replace(' ', '').replace(' ', '');

      
      itemData.owner_information = $(ownerInformationDiv).find('table tbody tr').eq(1).find('td table tbody tr').eq(1).text();

      itemData.mailing_address = $(ownerInformationDiv).find('#MainContent_lblAddrLine1').text() + ' '+ $(ownerInformationDiv).find('#MainContent_lblAddrLine3').text();

      itemData.sales_date = $(salesInformationDiv).find('#MainContent_gvSalesInfo tbody tr').eq(1).find('td').eq(0).text().replace('\n', '');
      itemData.price = $(salesInformationDiv).find('#MainContent_gvSalesInfo tbody tr').eq(1).find('td').eq(1).text().replace('\n', '');

      itemData.or_bookpage = $(salesInformationDiv).find('#MainContent_gvSalesInfo_lnkbookpg_0').text().replace('\n', '').replace(' ', '');

      itemData.sale_type = $(salesInformationDiv).find('#MainContent_gvSalesInfo_lblSaleType_0').text().replace('\n', '');

      itemData.owner = $(salesInformationDiv).find('#MainContent_gvSalesInfo tbody tr').eq(1).find('td').eq(4).text().replace('\n', '');



      itemData.improvement_value = $(appraisalsDiv).find('#MainContent_lblImpValue1').text().replace('\n', '');
      itemData.land_value = $(appraisalsDiv).find('#MainContent_lblLandValue1').text().replace('\n', '');
      itemData.total_market_value = $(appraisalsDiv).find('#MainContent_lblMarketValue1').text().replace('\n', '');
      itemData.assessed_value = $(assessedValuesDiv).find('#MainContent_lblAssessedValue1').text().replace('\n', '');
      itemData.exemption_amount = $(assessedValuesDiv).find('#MainContent_lblExemptionAmt1').text().replace('\n', '');
      itemData.taxable_value = $(assessedValuesDiv).find('#MainContent_lblTaxableValue1').text().replace('\n', '');
      itemData.ad_valorem = $(taxesDiv).find('#MainContent_lblAdValorem1').text().replace('\n', '');
      itemData.non_ad_valorem = $(taxesDiv).find('#MainContent_lblNonAdValorem1').text().replace('\n', '');
      itemData.total_tax = $(taxesDiv).find('#MainContent_lblTaxes1').text().replace('\n', '');


      res.send(itemData);
  
    } catch (err) {
      res.send({
          'err':err
      });
    }

  
}

const scrapData4 = async (req, res) => {

  try {
      // const url = req.query.url || "https://palmbeach.realforeclose.com/index.cfm?zaction=USER&zmethod=CALENDAR";
      const url = req.body.url;
      console.log('Crowl '+ url);

      // return res.send({url:url});
  


      const browser = await puppeteer.launch({
        headless: 'new',
      });
      const page = await browser.newPage();

      await page.goto(url, {waitUntil: 'load', timeout: 600000});

      const content = await page.content();
      const htmlContent = content;
      const regex = /GetDetailSection\('(\d+)', \d+, true\);/;
      // Use the regular expression to extract the value
      const match = htmlContent.match(regex);

      var  extractedValue;

      // Check if there is a match and retrieve the value
      if (match && match[1]) {
        extractedValue = match[1];
      } 

      var HTMLData;


      HTMLData = await page.evaluate(async (extractedValue) => {

        const url = `https://erec.mypalmbeachclerk.com/Document/Index`;
        const formData = {
          id: extractedValue,
          row: 0,
          time: new Date().toString(),
        };
  
        // Convert the form data to a URL-encoded string
        const formDataString = new URLSearchParams(formData).toString();
        const response = await fetch(url,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formDataString,
        });
        return response.text();
      }, extractedValue);

      

    
      // const { data } = await axios.get(url, { httpsAgent });
      const $ = cheerio.load(HTMLData);
      // console.log('Data HTML',$.html())


      const listItems = $("#documentInformationParent table tbody tr");
      
      let dataObj = [];
      
      const itemData = {book_type: "", book_number: "", book_page:"", page_number: "", instrument_no: "", record_date:"", doc_type:"", number_of_pages:"", number_of_names:"", grantor:"", grantee:"", doc_legals:"", case_number:"", county:""};

      listItems.each((idx, el) => {

        var item_html = $(el).html();
        console.log(item_html);


       
        


        if($(el).find('.boldTD label').text() == ' Instrument #'){
          itemData.instrument_no = $(el).find('td').eq(1).text().replace('\n', '').replace(' ', '').trim().replace(/\n/g, '');
        }
        if($(el).find('.boldTD label').text() == ' Book Type'){
          itemData.book_type = $(el).find('td').eq(1).text().replace('\n', '').replace(' ', '').trim().replace(/\n/g, '');
        }
        if($(el).find('.boldTD label').text() == ' Record Date'){
          itemData.record_date = $(el).find('td').eq(1).text().replace('\n', '').trim().replace(/\n/g, '');
        }

        if($(el).find('.boldTD label').text() == ' Doc Type'){
          itemData.doc_type = $(el).find('td').eq(1).text().replace('\n', '').trim().replace(/\n/g, '');
        }
        if($(el).find('.boldTD label').text() == ' Number of Pages'){
          itemData.number_of_pages = $(el).find('td').eq(1).text().replace('\n', '').trim().replace(/\n/g, '');
        }
        if($(el).find('.boldTD label').text() == ' Number of Names'){
          itemData.number_of_names = $(el).find('td').eq(1).text().replace('\n', '').trim().replace(/\n/g, '');
        }

        if($(el).find('.boldTD label').text() == ' Case Number'){
          itemData.case_number = $(el).find('td').eq(1).text().replace('\n', '').trim().replace(/\n/g, '');
        }

        if($(el).find('.boldTD label').text() == ' Doc. Legals'){
          itemData.doc_legals = $(el).find('td').eq(1).text().replace('\n', '').trim().replace(/\n/g, '');
        }
    
        if($(el).find('.boldTD label').text() == ' Grantor'){
          itemData.grantor = $(el).find('td').eq(1).text().replace('\n', '').trim().replace(/\n/g, '').split(/\s{2,}/).map(value => value.trim()).join(',');
        }
    

        if($(el).find('.boldTD label').text() == ' Grantee'){
          itemData.grantee = $(el).find('td').eq(1).text().replace('\n', '').trim().replace(/\n/g, '').split(/\s{2,}/).map(value => value.trim()).join(',');
        }

        
        if($(el).find('.boldTD label').text() == ' Book/Page'){
          const inputString = $(el).find('td').eq(1).text().replace('\n', '').trim().replace(/\n/g, '');
          itemData.book_page = inputString;

          const match = inputString.match(/(\d+) \/ (\d+)/);
          
          if (match && match.length === 3) {
            const bookNumber = match[1];
            const pageNumber = match[2];
            itemData.book_number = bookNumber;
            itemData.page_number = pageNumber;
          }

        }
     


        // if($(els).find('.AD_LBL').text() == 'Case #:'){
        //   itemData.book_number = $(els).find('.AD_DTA').text().replace('\n', '').replace(' ', '');
       
        // }

        // if($(els).find('.AD_LBL').text() == 'Final Judgment Amount:'){
        //   itemData.page_number = $(els).find('.AD_DTA').text().replace('\n', '').replace(' ', '');
        // }

        

        

        

        
        



        // // itemData.answer = $(el).find('p button').attr('data-answer');
        // dataObj.push(itemData);
        
      });
  
  
      // return dataObj;
      res.send(itemData);
  
    } catch (err) {
      res.send({
          'err':err
      });
    }

  
}





// ----------------------------------------------------------------------




const scrapData2 = async (req, res) => {

  const currentDate = new Date();
  const timestamp = currentDate.getTime();

 

  try {
    const url = req.query.url || "https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&Zmethod=PREVIEW&AUCTIONDATE="+req.query.date;

    const data_url = `https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&Zmethod=UPDATE&FNC=LOAD&AREA=R&PageDir=0&doR=1&tx=${timestamp}&bypassPage=0&test=1&_=${timestamp}`;
    // console.log('Crowl '+ url);

    const data_url_page_1 = `https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&Zmethod=UPDATE&FNC=LOAD&AREA=W&PageDir=0&doR=1&tx=${timestamp}&bypassPage=1&test=1&_=${timestamp}`;
    console.log('Crowl '+ url);
  


    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, {waitUntil: 'load', timeout: 600000});

    // const content = await page.content();
    // console.log('Content', content);

    // console.log('HEAD PAGES',cheerio.load(content).find('.Head_W .PageFrame'));
  

    const dataUrl = data_url; 


    var jsonData;

    jsonData = await page.evaluate(async (url) => {
      const response = await fetch(url);
      return response.json();
    }, dataUrl);

    if(jsonData.retHTML === ""){
       jsonData = await page.evaluate(async (url) => {
        const response = await fetch(url);
        return response.json();
      }, data_url_page_1);
    }

    // console.log('Api Response', jsonData);
    res.send(jsonData);

    var secondAPIPrams =  jsonData.rlist;
    var JsonDataHTML = jsonData.retHTML;


    const data_url2 = `https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&ZMETHOD=UPDATE&FNC=UPDATE&ref=${secondAPIPrams},&tx=${timestamp}&_=${timestamp}`;
    const dataUrl2 = data_url2;

    const jsonData2 = await page.evaluate(async (url) => {
      const response = await fetch(url);
      return response.json();
    }, dataUrl2);

    const noOfPages = jsonData2.WM;
    console.log('No Of Pages', noOfPages);

    var allAitemData;
    jsonData2.newVariable = "NewValue1";
    const aitem1 = jsonData2.ADATA && jsonData2.ADATA.AITEM ? jsonData2.ADATA.AITEM : [];
    allAitemData = aitem1;
    // console.log('1ST ',JsonDataHTML);

    // JsonDataHTML += '<div id="deep"></div>';
    // console.log('2nd ',JsonDataHTML);


    // Loop Logic

    if(noOfPages == 2){

      const page2URL = `https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&Zmethod=UPDATE&FNC=LOAD&AREA=W&PageDir=1&doR=0&tx=${new Date().getTime()}&bypassPage=0&test=1&_=${new Date().getTime()}`;
      var jsonData2Page;
      jsonData2Page = await page.evaluate(async (url) => {
        const response = await fetch(url);
        return response.json();
      }, page2URL);

      JsonDataHTML += jsonData2Page.retHTML;


      // Amount Data
      var secondAPIPrams2 =  jsonData2Page.rlist;

      const data_url3 = `https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&ZMETHOD=UPDATE&FNC=UPDATE&ref=${secondAPIPrams2},&tx=${new Date().getTime()}&_=${new Date().getTime()}`;
      const dataUrl3 = data_url3;
  
      const jsonData3 = await page.evaluate(async (url) => {
        const response = await fetch(url);
        return response.json();
      }, dataUrl3);


      jsonData3.newVariable = "NewValue2";

      // Extract data under the "AITEM" key from each JSON object
      const aitem2 = jsonData3.ADATA && jsonData3.ADATA.AITEM ? jsonData3.ADATA.AITEM : [];

      // Combine all AITEM data into a single array
      allAitemData = [...aitem1, ...aitem2];


    }

    if(noOfPages == 3){
      
      const page2URL = `https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&Zmethod=UPDATE&FNC=LOAD&AREA=W&PageDir=1&doR=0&tx=${new Date().getTime()}&bypassPage=0&test=1&_=${new Date().getTime()}`;
      var jsonData2Page;
      jsonData2Page = await page.evaluate(async (url) => {
        const response = await fetch(url);
        return response.json();
      }, page2URL);

      
      JsonDataHTML += jsonData2Page.retHTML;

      // Amount Data
      var secondAPIPrams2 =  jsonData2Page.rlist;

      const data_url3 = `https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&ZMETHOD=UPDATE&FNC=UPDATE&ref=${secondAPIPrams2},&tx=${new Date().getTime()}&_=${new Date().getTime()}`;
      const dataUrl3 = data_url3;
  
      const jsonData3 = await page.evaluate(async (url) => {
        const response = await fetch(url);
        return response.json();
      }, dataUrl3);

      // console.log('API_3 ', jsonData3);


      const page3URL = `https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&Zmethod=UPDATE&FNC=LOAD&AREA=W&PageDir=1&doR=0&tx=${new Date().getTime()}&bypassPage=0&test=1&_=${new Date().getTime()}`;
      var jsonData3Page;
      jsonData3Page = await page.evaluate(async (url) => {
        const response = await fetch(url);
        return response.json();
      }, page3URL);
      JsonDataHTML += jsonData3Page.retHTML;


      // Amount Data
      var secondAPIPrams3 =  jsonData3Page.rlist;

      const data_url4 = `https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&ZMETHOD=UPDATE&FNC=UPDATE&ref=${secondAPIPrams3},&tx=${new Date().getTime()}&_=${new Date().getTime()}`;
      const dataUrl4 = data_url4;
  
      const jsonData4 = await page.evaluate(async (url) => {
        const response = await fetch(url);
        return response.json();
      }, dataUrl4);

      
      // console.log('API_1 ', jsonData2);
      // console.log('API_2 ', jsonData3);
      // console.log('API_3 ', jsonData4);

      jsonData3.newVariable = "NewValue2";
      jsonData4.newVariable = "NewValue3";

      // Extract data under the "AITEM" key from each JSON object
      const aitem2 = jsonData3.ADATA && jsonData3.ADATA.AITEM ? jsonData3.ADATA.AITEM : [];
      const aitem3 = jsonData4.ADATA && jsonData4.ADATA.AITEM ? jsonData4.ADATA.AITEM : [];

      // Combine all AITEM data into a single array
      allAitemData = [...aitem1, ...aitem2, ...aitem3];

      // Display the result
      // console.log('ALL',allAitemData);


    }










      var htmlFilter =  JsonDataHTML.replace(/@C/g, 'class="').replace(/@E/g, 'AUCTION').replace(/@B/g, '</div>').replace(/@I/g, 'table').replace(/@G/g, '</td>').replace(/@A/g,'<div class="');
      // console.log('HTML puppeteer ',htmlFilter);
      const $ = cheerio.load(htmlFilter);
      const listItems = $(".AUCTION_ITEM");
      let dataObj = [];
      listItems.each((idx, el) => {
        //  `adlbl`, `auction_type`, `case_number`, `count_of_active_auction`, `count_of_total_auction`, `date_of_auction`, `day_of_auction_date_format`, `final_judgment_amount`, `no_r_or_w_cases`, `parcel_id`, `plaintiff_max_bid`, `property_address`, `case_no_url`,


        const itemData = {aid:"",auction_type: "", case_number: "",count_of_active_auction: "", count_of_total_auction: "", date_of_auction:"", day_of_auction_date_format:"",final_judgment_amount: "", no_r_or_w_cases:"", parcel_id: "",  plaintiff_max_bid: "", property_address: "", case_no_url: "", assessed_value:""};

        itemData.aid = $(el).attr('aid');

        $(el).find('table.ad_tab tr').each((idxs, els) => {
          
          

          if($(els).find('.AD_LBL').text() == 'Auction Type:'){
            itemData.auction_type = $(els).find('.AD_DTA').text().replace('\n', '').replace(' ', '');
          }

          if($(els).find('.AD_LBL').text() == 'Case #:'){
            itemData.case_number = $(els).find('.AD_DTA').text().replace('\n', '').replace(' ', '');
            itemData.case_no_url = $(els).find('.AD_DTA a').attr('href');
          }

          if($(els).find('.AD_LBL').text() == 'Final Judgment Amount:'){
            itemData.final_judgment_amount = $(els).find('.AD_DTA').text().replace('\n', '').replace(' ', '');
          }

          if($(els).find('.AD_LBL').text() == 'Parcel ID:'){
            itemData.parcel_id = $(els).find('.AD_DTA').text().replace('\n', '').replace(' ', '');
          }

          if($(els).find('.AD_LBL').text() == 'Plaintiff Max Bid:'){
            itemData.plaintiff_max_bid = $(els).find('.AD_DTA.ASTAT_MSGPB').html().replace('\n', '').replace(' ', '');
          }

          if($(els).find('.AD_LBL').text() == 'Assessed Value:'){
            itemData.assessed_value = $(els).find('.AD_DTA').html().replace('\n', '').replace(' ', '');
          }


          if($(els).find('.AD_LBL').text() == 'Property Address:'){
            itemData.property_address = $(els).find('.AD_DTA').html().replace('\n', '');
          }

          if($(els).find('.AD_LBL').text() == ''){
            itemData.property_address = itemData.property_address + ' ' + $(els).find('.AD_DTA').html().replace('\n', '');
          }

        });

        dataObj.push(itemData);
        
      });

      var yourData = {dataObj : dataObj, priceData : allAitemData};



      yourData.dataObj.forEach((item) => {

        const matchingAItem = yourData.priceData.find((aItem) => aItem.AID === item.aid);
        if (matchingAItem) {
          item.plaintiff_max_bid = matchingAItem.P;
        }


      });


      // console.log(JSON.stringify(yourData, null, 2));
      // console.log(yourData.dataObj);
  
      res.send(yourData.dataObj);
      
  
    } catch (err) {
      res.send({
          'err':err
      });
    }

  
}








const UsController = {
    scrapData,
    scrapData2,
    scrapData3,
    scrapData4
}

export default UsController;
