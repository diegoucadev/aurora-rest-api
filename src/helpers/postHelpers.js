import Post from '../model/post.model.js'

export function createPostData(userId, body) {
    const bookDetails = {
        title: body.title,
        author: body.author,
        condition: body.condition,
        synopsis: body.synopsis,
        genre: body.genre,
        yearPublished: body.yearPublished,
        pages: body.pages,
        isbn: body.isbn,
        publisher: body.publisher,
        language: body.language,
        price: body.price
    }

    const post = new Post({
        datePublished: body.datePublished,
        publishedBy: userId,
        book: bookDetails,
        transactionType: body.transactionType
    })

    return post
}


export async function updatePostData(post, body) {
    const bookDetails = {
        title: body.title,
        author: body.author,
        condition: body.condition,
        synopsis: body.synopsis,
        genre: body.genre,
        yearPublished: body.yearPublished,
        pages: body.pages,
        isbn: body.isbn,
        publisher: body.publisher,
        language: body.language,
        price: body.price
    
    }
    
    post.datePublished = body.datePublished
    post.book = bookDetails
    post.transactionType = body.transactionType
}