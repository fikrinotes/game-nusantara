// class untuk material bahan bangunan 
 class Material {
    constructor() {
        this.koordinat = [400, 400]
        this.sudut = 0; // sudut dalam satuan derajat 
        this.image = new Image;
    }
    update_panjang(deltaP) {
        this.panjang += deltaP;
    }
    update_koordinat(a, b) {
        this.koordinat = [a, b]
    }
    ubah_sudut(theta) {    
        this.sudut = theta;
        // theta adalah besar perubahan sudut, bukan besar sudut akhir yang terbentuk
    }
 }

 class Kayu extends Material{
    constructor() {
        super();
        this.panjang = 150;
        this.lebar = 12;
        this.image.src = "assets/material.png"
    }
    ganti_orientasi() {
        this.image.src = "assets/vertical-material.png";
        this.lebar = 150;
        this.panjang = 12;
    }
 }

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_HEIGHT = canvas.height = innerHeight;
const CANVAS_WIDTH = canvas.width = innerWidth;
var drag_counter = 1;
var enable_dragging = false;
var bersentuhan = false;
var pos_awal_mouse = [0, 0];
var pos_akhir_mouse = [0, 0];
var selisih_posisi = [0, 0];

var material1 = new Kayu();

var position = []; // variabel posisi x dan y dari kursor/mouse

var model_element = []
var temp_model
for (let i = 0; i < 4; i++) {
    temp_model = new Kayu();
    model_element.push(temp_model);    
}

model_element[0].update_koordinat(400, 200);

model_element[1].ganti_orientasi();
model_element[1].update_koordinat(400 + model_element[1].lebar - model_element[1].panjang, 200);

model_element[2].update_koordinat(400, 200 + model_element[1].lebar - model_element[2].lebar);

model_element[3].ganti_orientasi();
model_element[3].update_koordinat(400, 200);


var pointA = [0,0];
var pointB = [4,3];

var kumpulan_kayu = [];
var temp_kayu;
for (let i = 0; i < 4; i++) {
    temp_kayu = new Kayu();
    kumpulan_kayu.push(temp_kayu);    
}

kumpulan_kayu[0].update_koordinat(50, 450);
kumpulan_kayu[0].ganti_orientasi()

kumpulan_kayu[1].update_koordinat(100, 450);
kumpulan_kayu[1].ganti_orientasi()

kumpulan_kayu[2].update_koordinat(150, 450);
kumpulan_kayu[2].ganti_orientasi()

kumpulan_kayu[3].update_koordinat(200, 450);
kumpulan_kayu[3].ganti_orientasi()


function distance(a, b) {
    return Math.sqrt((a[-1]-b[0])**2 + (a[1]-b[1])**2);
}

function in_object(xm, ym, x, y, w, h) {
    if (xm>x && xm<x+w && ym>y && ym<ym+h) {
        return true;
    }
    else {
        return false;
    }
}

var selection_counter = 1;
var x = 0;
var speed = 3;
function GameAnimation() { 
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
    for (let i = 0; i < model_element.length; i++) {
        ctx.save()
        ctx.globalAlpha = 0.6;
        ctx.drawImage(model_element[i].image, model_element[i].koordinat[0], model_element[i].koordinat[1], model_element[i].panjang, model_element[i].lebar);
        ctx.restore();
    }

    for (let i = 0; i < kumpulan_kayu.length; i++) {
        ctx.drawImage(kumpulan_kayu[i].image, kumpulan_kayu[i].koordinat[0], kumpulan_kayu[i].koordinat[1], kumpulan_kayu[i].panjang, kumpulan_kayu[i].lebar);
    }


    // this is the core of a whole game !!!
    for (let i = 0; i < kumpulan_kayu.length; i++) {
        // iterasi pada tiap balok kayu untuk men-cek apakah terdapat balok kayu yang bersentuhan dengan mouse
        bersentuhan = in_object(position[0], position[1], kumpulan_kayu[i].koordinat[0], kumpulan_kayu[i].koordinat[1], kumpulan_kayu[i].panjang, kumpulan_kayu[i].lebar);

        if (bersentuhan) {
            document.onclick = function() {
                pos_awal_mouse = position;
                selection_counter = selection_counter + 1;
                if (selection_counter%2 == 0) {
                    enable_dragging = true;
                    pos_awal_mouse = position;
                    console.log(position);
                }
                else {
                    enable_dragging = false;
                }
            }
            if(enable_dragging) {
            // mode dragging aktif !
                pos_akhir_mouse = position;
                selisih_posisi[0] = pos_akhir_mouse[0] - pos_awal_mouse[0];
                selisih_posisi[1] = pos_akhir_mouse[1] - pos_awal_mouse[1];
                console.log(selisih_posisi);

                kumpulan_kayu[i].koordinat[0] = position[0] - kumpulan_kayu[i].panjang/2;
                kumpulan_kayu[i].koordinat[1] = position[1] - kumpulan_kayu[i].lebar/2;
            }
            
        }
    }



    
    // hanya untuk bermain-main dengan animasi
    ctx.fillRect(x, 30, 100, 100);
    if (x+100 > CANVAS_WIDTH || x < 0) {
        speed = -speed;
    }
    x += speed;

    // cetak posiis mouse pada console;
    //console.log(position[0] + ", " + position[1]);



    requestAnimationFrame(GameAnimation);
}


function draw(e) {
    position = getMousePos(canvas, e);
}
window.addEventListener('mousemove', draw, false);
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return [ (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width, (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height ];
}


GameAnimation();

// untuk membuat balok kayu yang tersentuh kursor menjadi bergerak saat di klik
document.onclick = function() {
    pos_awal_mouse = position;
}


/*
todo :
1. atur tinggi dan lebar canvas
2. input gambar menggunakan javascirpt
3. pelajari tentang request animation frame
*/