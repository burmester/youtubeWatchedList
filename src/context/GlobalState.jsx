import React, { Component } from "react";

import Context from "./defaultContext";

import Levenshtein from 'fast-levenshtein';

const DEBUG = true;

class GlobalState extends Component {

  state = {
    data: [],
    error: false,
    isRating: false,
    isLoading: false
  };

  item = (name, price, comparePrice, category, image) => {
    return {
      name: name,
      price: price,
      comparePrice: comparePrice,
      category: category,
      image: image,
      selected: false,
      icaItems: [],
      matItems: [],
      matHemItems: []
    }
  }

  componentDidMount() {
    const data = localStorage.getItem("data");
    if (data) {
      this.loadData(data)
    }
  }

  removeData = callback => {
    localStorage.clear();
    this.setState({ data: [] }, callback);
  };

  saveData = callback => {
    if (DEBUG) {
      const data = this.state.data.map(item => ({
        ...item,
        items: {},
        result: item.result.map(store => ({
          ...store,
          items: store.items.map(item => ({
            ...item,
            icaItems: [],
            matItems: [],
            matHemItems: []
          }))
        }))
      })
      )
      localStorage.setItem("data", JSON.stringify(data));
    }
    callback()
  }

  loadData = (data) => {
    if (DEBUG) {
      const d = JSON.parse(data)
      d.forEach(async item => {
        this.rateItem(item)
        item.items = this.getSelectedItems(item)
      });
      this.setState({
        data: d
      });
    }
  }

  getMatHem = async (query) => {
    const response = await fetch("https://api.mathem.io/product-search/noauth/search/query?q=" + query + "&storeId=10&size=40&index=0&sortTerm=popular&sortOrder=desc",
      {
        "headers": {
          "accept": "application/json, text/plain, */*"
        },
        "method": "GET"
      });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    let list = [];
    for (const [index, p] of body.products.entries()) {
      if (index >= 10) break;
      list.push(this.item(p.name, p.price, p.comparisonPrice, p.department.name, p.images.SMALL))
    }
    return list
  }

  getHemkop = async (query) => {
    return false
    /*
    DO NOT WORK, CORS
    const response = await fetch("https://www.hemkop.se/search?avoidCache=1573151389596&q=" + query + "&size=40",
      {
        "method": "GET"
      });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body
    */
  }

  getIca = async (query) => {
    const searchResult = await fetch("https://handla.ica.se/api/search-info/v1/search/skus?storeId=13418&ct=B2C&searchTerm=" + query + "&skipCategories=true&limit=1200");
    const searchResultJson = await searchResult.json();
    const productsIds = searchResultJson.products.slice(0, 10).join()
    const response = await fetch("https://handla.ica.se/api/content/v1/collections/customer-type/B2C/store/ica-kvantum-liljeholmen-id_13418/products?productIds=" + productsIds);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    let list = [];
    for (const [index, p] of body.entries()) {
      if (index >= 10) break;
      list.push(this.item(p.product.name, p.price.listPrice, p.price.comparePrice, p.product.categories[0].categoryPath[1].name, "https://assets.icanet.se/t_product_medium_v1,f_auto/" + p.product.imageId + ".jpg"))
    }
    return list
  }

  getMat = async (query) => {
    const response = await fetch("https://hv77zjg5js-3.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.33.0)%3B%20Browser&x-algolia-application-id=HV77ZJG5JS&x-algolia-api-key=341b3805a05cef630a2ae8f1619600a4",
      {
        "credentials": "omit",
        "headers": {
          "accept": "application/json",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,sv;q=0.7",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          "pragma": "no-cache",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site"
        },
        "referrer": "https://www.mat.se/",
        "referrerPolicy": "origin-when-cross-origin",
        "body": "{\"requests\":[{\"indexName\":\"Prod_Product_5_most_sold\",\"params\":\"query=" + query + "&optionalFacetFilters=%5B%22featuredProductSearchTerm%3A" + query + "%22%5D&hitsPerPage=12&maxValuesPerFacet=40&page=0&getRankingInfo=false&facets=%5B%22categories.id%22%2C%22categories.lineageIds%22%2C%22labelTags.tag%22%2C%22displayBrand%22%2C%22_tags%22%2C%22id%22%2C%22tagNames%22%5D&tagFilters=ACTIVE%2C-SAMPLE\"}]}",
        "method": "POST",
        "mode": "cors"
      });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    let list = [];
    for (const [index, p] of body.results.pop().hits.entries()) {
      if (index >= 10) break;
      list.push(this.item(p.name, p.price, p.comparisonPrice, p.categories[0].firstLevelParentCategoryName, p.imageUrl))
    }
    return list
  }

  rateItem = (item) => {
    const pointsAlgorithm = (
      comparePrice1, comparePrice2,
      price1, price2,
      name1, name2,
      cat1, cat2,
      query) => {
      const diffcomparePrice = Math.round(Math.abs(comparePrice1 - comparePrice2));
      const diffPrice = Math.round(Math.abs(price1 - price2));
      const levName = Levenshtein.get(name1, name2);
      const levCat = Levenshtein.get(cat1, cat2);
      const levQuery = Levenshtein.get(query, name1);
      const levQueryPop = Levenshtein.get(query, name2);
      return diffcomparePrice * 5 + diffPrice + levName + levCat * 10 + levQuery + levQueryPop
    }
    const itemRates = (item, points) => {
      return {
        item: item,
        points: points
      }
    }
    const query = item.query
    const matHem = item.result.find(store => store.store === "matHem")
    const ica = item.result.find(store => store.store === "ica")
    const mat = item.result.find(store => store.store === "mat")

    matHem.items.forEach((matHemItem, i) => {
      ica.items.forEach((icaItem, j) => {
        const pointsIcaMatHem = pointsAlgorithm(
          icaItem.comparePrice, matHemItem.comparePrice,
          icaItem.price, matHemItem.price,
          icaItem.name, matHemItem.name,
          icaItem.category, matHemItem.category,
          query)

        matHemItem.icaItems.push(itemRates(icaItem, pointsIcaMatHem))
        icaItem.matHemItems.push(itemRates(matHemItem, pointsIcaMatHem))
      })
      mat.items.forEach((matItem, k) => {
        const pointsMathemMat = pointsAlgorithm(
          matItem.comparePrice, matHemItem.comparePrice,
          matItem.price, matHemItem.price,
          matItem.name, matHemItem.name,
          matItem.category, matHemItem.category,
          query)
        matHemItem.matItems.push(itemRates(matItem, pointsMathemMat))
        matItem.matHemItems.push(itemRates(matHemItem, pointsMathemMat))
      })
    })
    ica.items.forEach((icaItem, j) => {
      mat.items.forEach((matItem, k) => {
        const pointsMatIca = pointsAlgorithm(
          matItem.comparePrice, icaItem.comparePrice,
          matItem.price, icaItem.price,
          matItem.name, icaItem.name,
          matItem.category, icaItem.category,
          query)
        icaItem.matItems.push(itemRates(matItem, pointsMatIca))
        matItem.icaItems.push(itemRates(icaItem, pointsMatIca))
      })
    })
    return item
  }

  getSelectedItems = (item) => {
    const matHem = item.result.find(store => store.store === "matHem")
    const ica = item.result.find(store => store.store === "ica")
    const mat = item.result.find(store => store.store === "mat")

    let selected = matHem.items.find(item => item.selected)
    if (selected) {
      return {
        matHem: selected,
        ica: selected.icaItems.reduce((prev, curr) => prev.points < curr.points ? prev : curr).item,
        mat: selected.matItems.reduce((prev, curr) => prev.points < curr.points ? prev : curr).item
      }
    }
    selected = ica.items.find(item => item.selected)
    if (selected) {
      return {
        ica: selected,
        matHem: selected.matHemItems.reduce((prev, curr) => prev.points < curr.points ? prev : curr).item,
        mat: selected.matItems.reduce((prev, curr) => prev.points < curr.points ? prev : curr).item
      }
    }
    selected = mat.items.find(item => item.selected)
    if (selected) {
      return {
        ica: selected.icaItems.reduce((prev, curr) => prev.points < curr.points ? prev : curr).item,
        matHem: selected.matHemItems.reduce((prev, curr) => prev.points < curr.points ? prev : curr).item,
        mat: selected
      }
    }
    return {
      matHem: matHem.items[0],
      ica: matHem.items[0].icaItems.reduce((prev, curr) => prev.points < curr.points ? prev : curr).item,
      mat: matHem.items[0].matItems.reduce((prev, curr) => prev.points < curr.points ? prev : curr).item
    }
  }

  addItem = async (query, callback) => {
    if (this.state.data.find(item => item.query === query)) {
      callback()
      return false;
    }
    try {
      const matHem = await this.getMatHem(query)
      // const hemkop = await this.getHemkop(query)
      const ica = await this.getIca(query)
      const mat = await this.getMat(query)


      const item = {
        order: this.state.data.length,
        query: query,
        result: [
          { store: "matHem", items: matHem },
          { store: "ica", items: ica },
          { store: "mat", items: mat }
        ]
      }
      this.setState({
        error: false,
        data: [...this.state.data, item],
        isRating: true
      }, callback)

      this.rateItem(item)
      item.items = this.getSelectedItems(item)
      this.setState({ isRating: false })
    } catch (err) {
      this.setState({
        error: { code: 1, msg: query }
      }, callback)
    }
  }

  removeItem = async (removeItem, callback) => {
    this.setState({ data: this.state.data.filter(item => item.query !== removeItem.query) })
  }

  selectItem = async (selected, item) => {
    item.items.matHem.selected = false
    item.items.ica.selected = false
    item.items.mat.selected = false
    selected.selected = true
    item.items = this.getSelectedItems(item)
    this.setState({ data: this.state.data })
  }

  render() {
    return (
      <Context.Provider
        value={{
          data: this.state.data,
          error: this.state.error,
          isLoading: this.state.isLoading,
          isRating: this.state.isRating,
          saveData: this.saveData,
          removeData: this.removeData,
          removeItem: this.removeItem,
          addItem: this.addItem,
          selectItem: this.selectItem
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default GlobalState;
