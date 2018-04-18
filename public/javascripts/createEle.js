function createElement(html) {
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
}