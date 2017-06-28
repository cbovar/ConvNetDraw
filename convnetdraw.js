var convnetdraw = { REVISION: 'ALPHA' };
(function (global) {
    "use strict";

    var drawing = function (id) {
        this.ratio1 = 0.3;
        this.offset = 300;

        this.zoomx = 4;
        this.zoomy = 4;
        this.zoomz = 4;

        // Set up our canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        var content = document.getElementById(id);
        content.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    drawing.prototype = {
        drawItem: function (title, dim0, dim1, dim2, color) {
            // draw the cube
            this.drawCube(
                this.offset,
                window.innerHeight / 2 + dim1 * this.zoomy / 2,
                Number(dim2 * this.zoomx),
                Number(dim1 * this.zoomz),
                Number(dim0 * this.zoomy),
                color
            );

            var text = `${dim0}x${dim1}x${dim2}`;
            var textWidth = this.ctx.measureText(text).width;
            this.ctx.fillStyle = "black";
            this.ctx.fillText(text, this.offset + dim0 * this.zoomy * this.ratio1 + (dim2 * this.zoomx - textWidth) / 2, window.innerHeight / 2 - dim1 * this.zoomz - 5);

            this.offset += dim2 * this.zoomx + dim0 * this.zoomy * this.ratio1 + 5;
        },

        draw: function () {
            this.offset = 300;

            // clear the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawItem("input", 28, 28, 1, "#00c8fa");
            this.drawItem("conv", 24, 24, 8, "#5bc3c4");
            this.drawItem("relu", 24, 24, 8, "#ffc33f");
            this.drawItem("pool", 12, 12, 8, "#f9e3b4");
            this.drawItem("conv", 10, 10, 16, "#5bc3c4");
            this.drawItem("relu", 10, 10, 16, "#ffc33f");
            this.drawItem("pool", 4, 4, 16, "#f9e3b4");
            this.drawItem("fullyconn", 1, 1, 10, "#fe4d66");
            this.drawItem("softmax", 1, 1, 10, "#ffe4d66");

            requestAnimationFrame(this.draw.bind(this));
        },

        // Colour adjustment function
        // Nicked from http://stackoverflow.com/questions/5560248
        shadeColor: function (color, percent) {
            color = color.substr(1);
            var num = parseInt(color, 16),
                amt = Math.round(2.55 * percent),
                R = (num >> 16) + amt,
                G = (num >> 8 & 0x00FF) + amt,
                B = (num & 0x0000FF) + amt;
            return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
        },

        // Draw a cube to the specified specs
        drawCube: function (x, y, wx, wy, h, color) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + wx, y);
            this.ctx.lineTo(x, y);
            this.ctx.lineTo(x, y - h);
            this.ctx.lineTo(x + wx, y - h * 1);
            this.ctx.closePath();
            this.ctx.fillStyle = this.shadeColor(color, -10);
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.moveTo(x + wx, y);
            this.ctx.lineTo(x + wx + wy * this.ratio1, y - wy * 0.5);
            this.ctx.lineTo(x + wx + wy * this.ratio1, y - h - wy * 0.5);
            this.ctx.lineTo(x + wx, y - h * 1);
            this.ctx.closePath();
            this.ctx.fillStyle = this.shadeColor(color, 10);
            this.ctx.strokeStyle = this.shadeColor(color, 50);
            this.ctx.stroke();
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.moveTo(x + wx, y - h);
            this.ctx.lineTo(x, y - h);
            this.ctx.lineTo(x + wy * this.ratio1, y - h - (wy * 0.5));
            this.ctx.lineTo(x + wx + wy * this.ratio1, y - h - wy * 0.5);
            this.ctx.closePath();
            this.ctx.fillStyle = this.shadeColor(color, 20);
            this.ctx.strokeStyle = this.shadeColor(color, 60);
            this.ctx.stroke();
            this.ctx.fill();


             this.ctx.beginPath();
            this.ctx.moveTo(x + wx, y);
            this.ctx.lineTo(x, y);
            this.ctx.lineTo(x, y - h);
            this.ctx.lineTo(x + wx, y - h * 1);
            this.ctx.closePath();
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x + wx, y);
            this.ctx.lineTo(x + wx + wy * this.ratio1, y - wy * 0.5);
            this.ctx.lineTo(x + wx + wy * this.ratio1, y - h - wy * 0.5);
            this.ctx.lineTo(x + wx, y - h * 1);
            this.ctx.closePath();
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x + wx, y - h);
            this.ctx.lineTo(x, y - h);
            this.ctx.lineTo(x + wy * this.ratio1, y - h - (wy * 0.5));
            this.ctx.lineTo(x + wx + wy * this.ratio1, y - h - wy * 0.5);
            this.ctx.closePath();
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
        }
    }

    global.drawing = drawing;

})(convnetdraw);