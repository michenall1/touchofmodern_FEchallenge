function domobj() {
  var self = this;
  self.products = [];

  self.getproducts = function(url) {
    return $.getJSON(url, function(response) {
      for (i = 0; i < response.sales.length; i++) {
        self.products.push(new Productobj(response.sales[i], i));
      }
    });
  };

  self.updateproducthtml = function() {
    return $.get("product-template.html", function(template) {
      for (i = 0; i < self.products.length; i++) {
        self.products[i].updatehtml(template);
      }
    });
  };

  self.updatedom = function() {
    var i = 0;
    thishtml = "<div class='row'>";
    for (i = 0; i < self.products.length; i++) {
      thishtml += self.products[i].htmlview;
    }
    thishtml += "</div>";
    $("#content").append(thishtml);
  };

  self.attachEventListener = function() {
    $(".container").on("click", ".cross", function(e) {
      console.log("click on X");
      e.stopPropagation();
      e.preventDefault();
      $(e.target)
        .closest(".product-container")
        .remove();
    });
  };
}

function Productobj(product, i) {
  var self = this;
  self.photo = product.photos.medium_half;
  self.title = product.name;
  self.tagline = product.tagline;
  self.url = product.url;
  self.htmlview = "";
  self.index = i;
  self.custom_class = "col-sm-12 col-md-6 col-lg-4";
  self.detail_text = product.description;

  self.updatehtml = function(template) {
    self.htmlview = template
      .replace("{image}", self.photo)
      .replace("{title}", self.title)
      .replace("{tagline}", self.tagline)
      .replace("{url}", self.url)
      .replace("{custom_class}", self.custom_class)
      .replace("{detail_text}", self.detail_text);
  };
}

var page = new domobj();
// Here the load should be chained using promises.
// Since jQuery get() and getJSON() return promises, they are easily chained with some
// modification in the function (returning the promise).
// I changed the updatehtml function so that the page will only need to
// fire one async call to get the product-template.
page
  .getproducts("data.json")
  .then(function() {
    return page.updateproducthtml();
  })
  .then(function() {
    page.updatedom();
    page.attachEventListener();
  });
