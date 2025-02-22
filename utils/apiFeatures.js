const { Op } = require('sequelize');

class APIFeatures {
  constructor(queryParams) {
    this.queryParams = queryParams;
    this.queryOptions = {}; // Options to pass to Sequelize's findAll()
  }

  
  filter() {
    const queryObj = { ...this.queryParams };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    const where = {};
    
    for (const key in queryObj) {
      if (queryObj.hasOwnProperty(key)) {
        // Check if the value is an object containing operators
        if (typeof queryObj[key] === 'object' && !Array.isArray(queryObj[key])) {
          const fieldOperators = queryObj[key];
          where[key] = {};
          
          for (const opKey in fieldOperators) {
            let op;
            switch (opKey) {
              case 'gte': op = Op.gte; break;
              case 'gt': op = Op.gt; break;
              case 'lte': op = Op.lte; break;
              case 'lt': op = Op.lt; break;
              default: continue;
            }
            
            // Convert the value to number for numeric fields
            const numericValue = Number(fieldOperators[opKey]);
            if (!isNaN(numericValue)) {
              where[key][op] = numericValue;
            }
          }
        } else {
          // Handle normal fields
          where[key] = queryObj[key];
        }
      }
    }

    this.queryOptions.where = where;
    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      // Supports multiple fields; use '-' prefix for descending
      const sortBy = this.queryParams.sort.split(',').map(field => {
        if (field.startsWith('-')) {
          return [field.substring(1), 'DESC'];
        }
        return [field, 'ASC'];
      });
      this.queryOptions.order = sortBy;
    }
    return this;
  }

  limitFields() {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields.split(',');
      this.queryOptions.attributes = fields;
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryParams.page) || 1;
    const limit = parseInt(this.queryParams.limit) || 20;
    const offset = (page - 1) * limit;
    this.queryOptions.limit = limit;
    this.queryOptions.offset = offset;
    return this;
  }
}

module.exports = APIFeatures;
