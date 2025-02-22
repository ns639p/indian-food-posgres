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
        if (key.includes('[')) {
          // e.g., prep_time[gte]=15
          const match = key.match(/(.+)\[(gte|gt|lte|lt)\]/);
          if (match) {
            const field = match[1];
            const operator = match[2];
            let op;
            switch (operator) {
              case 'gte': op = Op.gte; break;
              case 'gt': op = Op.gt; break;
              case 'lte': op = Op.lte; break;
              case 'lt': op = Op.lt; break;
            }
            if (!where[field]) where[field] = {};
            where[field][op] = queryObj[key];
          }
        } else {
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
