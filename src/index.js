const qouteList = document.getElementById('quote-list');
const newQuoteForm = document.getElementById('new-quote-form');

function renderOneQuote(quote){

    const li = document.createElement('li');
    const blockquote = document.createElement('blockquote');
    const p = document.createElement('p');
    const footer = document.createElement('footer');
    const br = document.createElement('br');
    const btn = document.createElement('button');
    const span = document.createElement('span');
    const button = document.createElement('button');

    li.className = 'quote-card';
    blockquote.className = 'blockqoute';
    p.className = 'mb-0';
    p.innerText = `${quote.quote}`;
    footer.className = 'blockquote-footer';
    footer.textContent = `${quote.author}`
    btn.className = 'btn-success';
    btn.textContent = 'Likes:';
    span.textContent = `${quote.likes.length}`;
    button.className = 'btn-danger';
    button.textContent = 'Delete'

    btn.appendChild(span)
    blockquote.append(p, footer, br, btn, button);
    li.appendChild(blockquote);
    qouteList.appendChild(li);

    button.addEventListener('click', ()=>{
        li.remove();
        deleteQuote(quote.id)        
    })
    
    btn.addEventListener('click', ()=>{
        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: 'application/json'
            },
            body: JSON.stringify({
                quoteId: quote.id
            })
        })
        .then(res => res.json())
        .then(like =>{
            quote.likes.push(like);
            span.innerText = quote.likes.length;
        })
    })
}

function getAllQuotes(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(data => data.forEach(quote => {
        renderOneQuote(quote)
    }))
    .catch(error => console.log(error))
}
getAllQuotes();


newQuoteForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    let newQuote ={
        quote: e.target.quote.value,
        author: e.target.author.value,
        likes: []
    }

    postQuote(newQuote);
    newQuoteForm.reset();
    renderOneQuote(newQuote);
})

function postQuote(newQuote){
    fetch(`http://localhost:3000/quotes?_embed=likes/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(newQuote)
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}

function deleteQuote(id){
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}
