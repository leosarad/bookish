const navbarSearch = document.querySelector('.navbar-search')
navbarSearch.addEventListener('focus',()=>{
     let searchResults = document.querySelector('.search-results')
     searchResults.style.display="block"
})
navbarSearch.addEventListener('focusout',()=>{
     let searchResults = document.querySelector('.search-results')
     searchResults.style.display="none"
})
const searchBook = async (event)=>{
     const searchBox = event.currentTarget
     const query = searchBox.value
     const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5&fields=kind,items(id,volumeInfo(title,authors,imageLinks))`
     const response = await fetch(url)
     response.json()
     .then(result=>{
          let books = []
          if(result.items) {
               books = result.items.map(book=>({
                    'id': book.id || undefined,
                    'title': book.volumeInfo.title || "unKnown",
                    'thumbnail': (book.volumeInfo.imageLinks)?book.volumeInfo.imageLinks.thumbnail : "",
                    'authors': (book.volumeInfo.authors)?book.volumeInfo.authors.toString(): "unKnown"

               }))
          }
          displaySearchResults(books)
     })          
}
const displaySearchResults = (books)=>{
     let wrapper = document.querySelector('.search-results')
     wrapper.innerHTML=""
     if(!books.length){
          let element = document.createElement('div')
          element.innerText = "No results found"
          element.setAttribute('class','search-guide')
          wrapper.appendChild(element)
          return 
     }
     books.forEach(book=>{
          let element = document.createElement('div')
          element.setAttribute('class','book')
          element.innerHTML=`
                    <a href="book/${book.id}">
                         <img src="${book.thumbnail}" >
                         <div class="details">
                              <div class="title">${book.title}</div>
                              <div class="author"> <b>Author: </b>${book.authors}</div>
                         </div>
                    </a>
          `
          element.onClick
          wrapper.append(element)
     })
}