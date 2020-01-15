export {GiphyResult};
class GiphyResult{
    constructor(result){
        //result is a JSON object
        //1 - get "small image" URL
        let smallURL = result.images.fixed_width_small.url;
        if(!smallURL) smallURL = "../images/no-image-found.png";
        this.smallURL = smallURL;

        //2 - get url to the GIPHY page
        this.url = result.url;

        //3 - get rating
        this.rating = (result.rating ? result.rating : "NA").toUpperCase();

        //4 - id
        this.id = result.id;

        //5 - build div to hold each result
        let line = `<div class = 'result'>`;
        line += `<img src='${this.smallURL}' title='${this.id}' />`;
        line += `<span><a target='_blank' href='${this.url}'>View on Giphy</a></span>`;
        line += `<p>Rating: ${this.rating}`;
        line += `</div>`;
        this.line = line;
    } //End constructor
}//End class