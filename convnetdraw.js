var convnetdraw = { REVISION: 'ALPHA' };
(function (global) {
    "use strict";

    var drawing = function (id) {
        // Set up our canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = document.getElementById(id).clientWidth;
        this.canvas.height = document.getElementById(id).clientHeight;

        var content = document.getElementById(id);
        content.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.ratio1 = document.querySelector('#ratio1');
        this.ratio2 = document.querySelector('#ratio2');

        this.zoomx = document.querySelector('#zoomx');
        this.zoomz = document.querySelector('#zoomz');
        this.zoomy = document.querySelector('#zoomy');
    }

    drawing.prototype = {
        drawItem: function (title, dim0, dim1, dim2, color) {
            var actualX = dim2 * this.zoomx.value;
            var actualZ = dim1 * this.zoomz.value;
            var actualY = dim0 * this.zoomy.value;

            // draw the cube
            this.drawCube(
                this.offset,
                this.canvas.clientHeight / 2 + dim1 * this.zoomy.value / 2,
                Number(actualX),
                Number(actualZ),
                Number(actualY),
                color
            );

            var text = `${dim0}x${dim1}x${dim2}`;
            var textWidth = this.ctx.measureText(text).width;
            this.ctx.fillStyle = "black";
            this.ctx.fillText(text,
                this.offset
                + actualY * this.ratio1.value / 1000
                + (actualX - textWidth) / 2,
                this.canvas.clientHeight / 2 - dim0 * (0.5 + this.ratio2.value / 1000) * this.zoomy.value - 5);

            this.offset += actualX + actualY * this.ratio1.value / 1000 + 5;
        },

        save: function () {
            window.open(this.canvas.toDataURL("image/png"));
        },

        draw: function (text) {
            this.offset = 10;

            // clear the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            var lines = text.split("\n");
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].length > 0) {
                    if (lines[i][0] != '#') {
                        try {
                            eval("this." + lines[i]);
                        } catch (e) {
                            var myRegexp = /(.*)\((.*),(.*),(.*)\)/g;
                            var match = myRegexp.exec(lines[i]);
                            if (match != null) {
                                this.generic(match[1], match[2], match[3], match[4]);
                            }
                        }
                    }
                }
            }

            requestAnimationFrame(this.draw.bind(this, text));
        },

        input: function (dim0, dim1, dim2) {
            this.drawItem("input", dim0, dim1, dim2, "#00c8fa");
        },

        conv: function (dim0, dim1, dim2) {
            this.drawItem("conv", dim0, dim1, dim2, "#5bc3c4");
        },

        relu: function (dim0, dim1, dim2) {
            this.drawItem("conv", dim0, dim1, dim2, "#ffc33f");
        },

        pool: function (dim0, dim1, dim2) {
            this.drawItem("pool", dim0, dim1, dim2, "#f9e3b4");
        },

        fullyconn: function (dim0, dim1, dim2) {
            this.drawItem("pool", dim0, dim1, dim2, "#fe4d66");
        },

        softmax: function (dim0, dim1, dim2) {
            this.drawItem("pool", dim0, dim1, dim2, "#ffe4d66");
        },

        generic: function (text, dim0, dim1, dim2) {
            this.drawItem("conv", dim0, dim1, dim2, "#00c8fa");
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
            this.ctx.lineTo(x + wx + wy * this.ratio1.value / 1000, y - wy * this.ratio2.value / 1000);
            this.ctx.lineTo(x + wx + wy * this.ratio1.value / 1000, y - h - wy * this.ratio2.value / 1000);
            this.ctx.lineTo(x + wx, y - h * 1);
            this.ctx.closePath();
            this.ctx.fillStyle = this.shadeColor(color, 10);
            this.ctx.strokeStyle = this.shadeColor(color, 50);
            this.ctx.stroke();
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.moveTo(x + wx, y - h);
            this.ctx.lineTo(x, y - h);
            this.ctx.lineTo(x + wy * this.ratio1.value / 1000, y - h - (wy * this.ratio2.value / 1000));
            this.ctx.lineTo(x + wx + wy * this.ratio1.value / 1000, y - h - wy * this.ratio2.value / 1000);
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
            this.ctx.lineTo(x + wx + wy * this.ratio1.value / 1000, y - wy * this.ratio2.value / 1000);
            this.ctx.lineTo(x + wx + wy * this.ratio1.value / 1000, y - h - wy * this.ratio2.value / 1000);
            this.ctx.lineTo(x + wx, y - h * 1);
            this.ctx.closePath();
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x + wx, y - h);
            this.ctx.lineTo(x, y - h);
            this.ctx.lineTo(x + wy * this.ratio1.value / 1000, y - h - (wy * this.ratio2.value / 1000));
            this.ctx.lineTo(x + wx + wy * this.ratio1.value / 1000, y - h - wy * this.ratio2.value / 1000);
            this.ctx.closePath();
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
        }
    }

    global.drawing = drawing;

})(convnetdraw);