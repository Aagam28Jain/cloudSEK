class ApiFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      //FILTERING
      const queryObj = { ...this.queryString };
  
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
      //kyuki hmko find method mai await lga hua hai to hm filtering saath nhi kr skte ye sirf find ka hi result dega to usko alag se kr rhe hai or sirf last operation mai await krenge
      //ADVANCE FILTERING
      //2)Advanced filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
      // req .query return the same filter object that we write in url
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
  
  }
  module.exports = ApiFeatures;