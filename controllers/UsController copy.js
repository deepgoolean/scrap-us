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


const scrapData2 = async (req, res) => {

  const currentDate = new Date();
  const timestamp = currentDate.getTime();

  try {
    const url = req.query.url || "https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&Zmethod=PREVIEW&AUCTIONDATE="+req.query.date;

    const data_url = `https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&Zmethod=UPDATE&FNC=LOAD&AREA=C&PageDir=0&doR=1&tx=${timestamp}&bypassPage=0&test=1&_=${timestamp}`;
    // console.log('Crowl '+ url);

    const data_url_page_1 = `https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&Zmethod=UPDATE&FNC=LOAD&AREA=C&PageDir=0&doR=1&tx=${timestamp}&bypassPage=1&test=1&_=${timestamp}`;
    console.log('Crowl '+ url);
  


    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, {waitUntil: 'load', timeout: 600000});

    const content = await page.content();
    const dataUrl = data_url; 

    const jsonData = await page.evaluate(async (url) => {
      const response = await fetch(url);
      return response.json();
    }, dataUrl);

    if(jsonData.retHTML === ""){
      const jsonData = await page.evaluate(async (url) => {
        const response = await fetch(url);
        return response.json();
      }, dataUrl);
    }

    console.log('Api Response', jsonData);

    var secondAPIPrams =  jsonData.rlist;

    const data_url2 = `https://palmbeach.realforeclose.com/index.cfm?zaction=AUCTION&ZMETHOD=UPDATE&FNC=UPDATE&ref=${secondAPIPrams},&tx=${timestamp}&_=${timestamp}`;
    const dataUrl2 = data_url2;

    const jsonData2 = await page.evaluate(async (url) => {
      const response = await fetch(url);
      return response.json();
    }, dataUrl2);

    var htmlFilter =  jsonData.retHTML.replace(/@C/g, 'class="').replace(/@E/g, 'AUCTION').replace(/@B/g, '</div>').replace(/@I/g, 'table').replace(/@G/g, '</td>').replace(/@A/g,'<div class="');

    console.log('HTML puppeteer ',htmlFilter);
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

      var yourData = {dataObj : dataObj, priceData : jsonData2};

      yourData.dataObj.forEach((item) => {
        const matchingAItem = yourData.priceData.ADATA.AITEM.find((aItem) => aItem.AID === item.aid);
      
        if (matchingAItem) {
          item.plaintiff_max_bid = matchingAItem.P;
        }
      });


      // console.log(JSON.stringify(yourData, null, 2));
      console.log(yourData.dataObj);
  
      res.send(yourData.dataObj);
      
  
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


const UsController = {
    scrapData,
    scrapData2,
    scrapData3
}

export default UsController;