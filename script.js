const END_POINT = "https://reqres.in/api";
var productsList = [];
var cartList = [];
var loading = false;

const deleteProduct = (e) => {
    var productId = getProductId(e);
    
    // fetch(END_POINT+"/products/"+productId, {
    //     method: 'DELETE',
    // }).then(response => fetchData())
    
    var newProductList = productsList.filter( p => p.id != productId);
    productsList = newProductList;
    document.querySelector(`div[productId='${productId}']`).remove();
    document.getElementById("model").style.display= "none";
    window.alert("A product is deleted!");
}

const closeModel = () => {
    document.getElementById("model").style.display = "none";
}

const getModelData = (product) => {
    var infoArray = Object.entries(product);
    const infoString = infoArray.map( i => 
        `<div><label>${i[0]}: </label><label class="input">${i[1]}</label></div>`
    ).join("");

    return `
            <div id="product-detail">
                <div  class="center">
                    <div class="product-color" style="background-color: ${product.color}"></div>
                    <div class="detail-info">
                    ${infoString}
                    </div>
                </div>
                <div class="button-box" style="margin: auto;">
                    <button>
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button productId=${product.id} onclick="deleteProduct(this)">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
                <div onclick="closeModel()"><i class="fas fa-times"></i></div>
            </div>
    `
}

const getProductId = (e) => {
    if(e.getAttribute("productId") != null){
        return e.getAttribute("productId");
    }else {
        return getProductId(e.parentElement);
    }
}

const showProduct = (e) => {
    currentProduct = productsList.find(p => p.id == getProductId(e));
    const modelString = getModelData(currentProduct);
    var model = document.getElementById("model");
    model.innerHTML=modelString;
    model.style.display = "flex";
    
}

const showCart = (e, show) => {
    e.firstElementChild.style.visibility = show ? "visible" : "hidden";
}

const getCartProduct = (product) => {
    return `
        <div class="cart-product center" id=${product.id}>
            <div class="cart-prod-color" style="background-color: ${product.color}"></div>
            <div class="cart-prod-info">
                <h4>${product.name}</h4>
                <p>$30</p>
            </div>
        </div>
    `
}

const addToCart = (e) => {
    var product = productsList.find(p => p.id == getProductId(e));
    cartList.push(product);
    const cartString = cartList.map(p => getCartProduct(p)).join("");
    document.getElementById("cart").innerHTML = cartString;
}

const getProductCards = (product) => {
    return `
        <div class="product-card center" productId=${product.id} onmouseover="showCart(this, true)" onmouseleave="showCart(this, false)" onclick="showProduct(this)">
            <div class="cart center" onclick="event.stopPropagation(); addToCart(this);"><i class="fas fa-shopping-cart"></i></div>
            <div class="product-color" style="background-color: ${product.color}"></div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>${product.color}</p>
            </div>
        </div>`
}

const setLoading = (fetching) => {
    document.getElementById("loader").style.visibility = fetching ? "visible" : "hidden";
}

const addProductCard = () => {
    return `
        <div class="product-card center">
                <i class="fas fa-plus" style="font-size: 50px"></i> 
        </div>`
}

const fetchData = () => {
    setLoading(true);
    fetch(END_POINT + "/products")
    .then(res => res.json())
    .then(data => {
      setLoading(false);
      productsList = data.data;
      const productsStr = data.data.map(p => getProductCards(p)).join("") + addProductCard();
      document.getElementById("product-holder").innerHTML = productsStr;
    })
    .catch(err => {
      setLoading(false);
      console.log(err);
    });
}

window.onload = () => {
    fetchData();
}

const showSelectedProducts = () => {
    var original = document.getElementById("cart").style.visibility;
    document.getElementById("cart").style.visibility = (original == "visible") ? "hidden" : "visible";
}