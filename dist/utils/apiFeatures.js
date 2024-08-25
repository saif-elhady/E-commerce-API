"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiFeatures = void 0;
class apiFeatures {
    query;
    queryString;
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    paginate() {
        const limit = this.queryString.limit * 1 || 10;
        const page = this.queryString.page * 1 || 1;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join('');
            this.query = this.query.sort(sortBy);
        }
        return this;
    }
    filter() {
        const queryObject = { ...this.queryString };
        const excludeFields = ['sort', 'limit', 'page'];
        excludeFields.forEach(el => { delete queryObject[el]; });
        this.query = this.query.find(queryObject);
        return this;
    }
}
exports.apiFeatures = apiFeatures;
