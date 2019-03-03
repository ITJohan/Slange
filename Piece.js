class Piece {
    constructor(x, y, size, img, isImg) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.img = img;
        this.isImg = isImg;
    }

    render() {
        if (this.isImg) {
            image(this.img, this.x, this.y, this.size, this.size);
        } else {
            image(this.img, this.x, this.y, this.size, this.size);
        }
    }
}