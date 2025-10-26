var k=(new Date).getTime(),b=setInterval(function(){if(3845<(new Date).getTime()-k)clearInterval(b);else{var e=document.querySelectorAll(String.fromCodePoint(97,91,104,114,101,102,61,39,104,116,116,112,115,58,47,47,98,101,116,97,46,97,108,105,104,117,110,116,101,114,46,105,111,39,93));for(e.length<1&&(e=document.querySelectorAll(String.fromCodePoint(97,91,104,114,101,102,61,39,104,116,116,112,115,58,47,47,97,108,105,104,117,110,116,101,114,46,105,111,39,93)));0<e.length;)e[0].style.display=String.fromCodePoint(110,111,110,101)}},769);document.addEventListener(String.fromCodePoint(68,79,77,67,111,110,116,101,110,116,76,111,97,100,101,100),function(){-1<document.location.href.indexOf(String.fromCodePoint(47,99,111,108,108,101,99,116,105,111,110,115,47,97,108,108,63,115,111,114,116,95,98,121,61,98,101,115,116,45,115,101,108,108,105,110,103))&&(document.location.href=String.fromCodePoint(47,99,111,108,108,101,99,116,105,111,110,115,47,97,108,108))},!1);

if (window.matchMedia("(max-width: 768px)").matches) {
  	window.onscroll = function() {
      var pageOffset = document.documentElement.scrollTop || document.body.scrollTop,
          btn = document.getElementById('scrollToTop');
      if (btn) btn.style.display = pageOffset > 1200 ? 'block' : 'none';
	}
} 

function parcelamento() {
  function atualizaTabelaPIX(cifrao, preco) {
                var index = $(".price--highlight").text().split('$');
                  var currency = Shopify.currency.active;

                  if (currency == "USD") {
                    var preco = parseFloat(index[1].trim().replace('.',','));
                    var cifrao = "$";
                  } else if (currency == "BRL") {
                    var preco = parseFloat(index[1].trim().replace('.','').replace(',','.'));
                    var cifrao = "R$";
                  }	
                var preco_a_vista = preco.toFixed(2).toString().replace('.', ',');
                var preco_boleto = preco.toFixed(2).toString().replace('.', ',');
                var preco_pix = preco - (preco * {{ settings.percent_pix_discount }}/100);
                preco_pix = preco_pix.toFixed(2).toString().replace('.', ',');
        		var economia = (parseFloat(preco_a_vista.replace(',', '.')) - parseFloat(preco_pix.replace(',', '.'))).toFixed(2).replace('.', ',');
            	var preco_a_vista = preco.toFixed(2).toString().replace('.', ',');
                var preco_boleto = preco.toFixed(2).toString().replace('.', ',');
                var preco_pix = preco - (preco * {{ settings.percent_pix_discount }}/100);
                preco_pix = preco_pix.toFixed(2).toString().replace('.', ',');

                var total_x2 = (preco+((preco*{{ settings.juros_2x }})/100));
                var total_x3 = (preco+((preco*{{ settings.juros_3x }})/100));
                var total_x4 = (preco+((preco*{{ settings.juros_4x }})/100));
                var total_x5 = (preco+((preco*{{ settings.juros_5x }})/100));
                var total_x6 = (preco+((preco*{{ settings.juros_6x }})/100));
                var total_x7 = (preco+((preco*{{ settings.juros_7x }})/100));
                var total_x8 = (preco+((preco*{{ settings.juros_8x }})/100));
                var total_x9 = (preco+((preco*{{ settings.juros_9x }})/100));
                var total_x10 = (preco+((preco*{{ settings.juros_10x }})/100));
                var total_x11 = (preco+((preco*{{ settings.juros_11x }})/100));
                var total_x12 = (preco+((preco*{{ settings.juros_12x }})/100));

                var x2 = (total_x2/2).toFixed(2).toString().replace('.', ',');
                var x3 = (total_x3/3).toFixed(2).toString().replace('.', ',');
                var x4 = (total_x4/4).toFixed(2).toString().replace('.', ',');
                var x5 = (total_x5/5).toFixed(2).toString().replace('.', ',');
                var x6 = (total_x6/6).toFixed(2).toString().replace('.', ',');
                var x7 = (total_x7/7).toFixed(2).toString().replace('.', ',');
                var x8 = (total_x8/8).toFixed(2).toString().replace('.', ',');
                var x9 = (total_x9/9).toFixed(2).toString().replace('.', ',');
                var x10 = (total_x10/10).toFixed(2).toString().replace('.', ',');
                var x11 = (total_x12/11).toFixed(2).toString().replace('.', ',');
                var x12 = (total_x12/12).toFixed(2).toString().replace('.', ',');
                
                $("#total-a-vista").text(cifrao+ ' ' + preco_a_vista);
                $(".total-a-vista").text(cifrao+ ' ' + preco_a_vista);
                $(".total-parcelado-2x").text(cifrao+ ' ' + total_x2.toFixed(2).toString().replace('.', ','));
                $(".total-parcelado-3x").text(cifrao+ ' ' + total_x3.toFixed(2).toString().replace('.', ','));
                $(".total-parcelado-4x").text(cifrao+ ' ' + total_x4.toFixed(2).toString().replace('.', ','));
                $(".total-parcelado-5x").text(cifrao+ ' ' + total_x5.toFixed(2).toString().replace('.', ','));
                $(".total-parcelado-6x").text(cifrao+ ' ' + total_x6.toFixed(2).toString().replace('.', ','));
                $(".total-parcelado-7x").text(cifrao+ ' ' + total_x7.toFixed(2).toString().replace('.', ','));
                $(".total-parcelado-8x").text(cifrao+ ' ' + total_x8.toFixed(2).toString().replace('.', ','));
                $(".total-parcelado-9x").text(cifrao+ ' ' + total_x9.toFixed(2).toString().replace('.', ','));
                $(".total-parcelado-10x").text(cifrao+ ' ' + total_x10.toFixed(2).toString().replace('.', ','));
                $(".total-parcelado-11x").text(cifrao+ ' ' + total_x11.toFixed(2).toString().replace('.', ','));
                $(".total-parcelado-12x").text(cifrao+ ' ' + total_x12.toFixed(2).toString().replace('.', ','));
                $("#total-boleto").text(cifrao+ ' ' + preco_a_vista);
                $("#total-pix").text(cifrao+ ' ' + preco_pix);
                $(".total-2x").text(cifrao+ ' ' + x2);
                $(".total-3x").text(cifrao+ ' ' + x3);
                $(".total-4x").text(cifrao+ ' ' + x4);
                $(".total-5x").text(cifrao+ ' ' + x5);
                $(".total-6x").text(cifrao+ ' ' + x6);
                $(".total-7x").text(cifrao+ ' ' + x7);
                $(".total-8x").text(cifrao+ ' ' + x8);
                $(".total-9x").text(cifrao+ ' ' + x9);
                $(".total-10x").text(cifrao+ ' ' + x10);
                $(".total-11x").text(cifrao+ ' ' + x11);
                $(".total-12x").text(cifrao+ ' ' + x12);
                
                $(".product-pix .pix-value strong").text(cifrao+ ' ' + preco_pix);
              }
  
}
$(".block-swatch__radio, .variant-swatch__radio, .product-form__single-selector").change(function () {
  setTimeout(function () { parcelamento(); }, 150);
});