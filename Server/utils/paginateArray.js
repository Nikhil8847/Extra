

const paginateArray = async ({documentId, arr, page, size, model}) => {
    const skip = (page-1)*size
    const data = await model.findById(documentId).select({
        arr: {$slice: [skip, size]}
    })
}