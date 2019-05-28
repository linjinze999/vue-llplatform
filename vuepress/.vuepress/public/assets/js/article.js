window.onload = function() {
    var click_cnt = 0;
    var special_cnt = 0;
    var default_text = "❤";
    var special_text = ["(๑•́ ∀ •̀๑)", "OωO", "(๑•́ ₃ •̀๑)", "(๑•̀_•́๑)", "（￣へ￣）", "o(￣▽￣)d", "╮(｡>口<｡)╭", "(o゜▽゜)o☆", "(ꐦ°᷄д°᷅)"];
    var $html = document.getElementsByTagName("html")[0];
    var $body = document.getElementsByTagName("body")[0];
    $html.onclick = function(e) {
        var $elem = document.createElement("b");
        $elem.style.color = "#E94F06";
        $elem.style.zIndex = 9999;
        $elem.style.position = "absolute";
        $elem.style.select = "none";
        var x = e.pageX;
        var y = e.pageY;
        $elem.style.left = (x - 10) + "px";
        $elem.style.top = (y - 20) + "px";
        clearInterval(anim);
        if(++click_cnt % 5 == 0){
            $elem.innerText = special_text[special_cnt++];
            special_cnt = special_cnt % special_text.length;
        }else{
            $elem.innerText = default_text;
        }
        $elem.style.fontSize = Math.random() * 5 + 11 + "px";
        var increase = 0;
        var anim;
        setTimeout(function() {
            anim = setInterval(function() {
                if (++increase == 150) {
                    clearInterval(anim);
                    $body.removeChild($elem);
                }
                $elem.style.top = y - 20 - increase + "px";
                $elem.style.opacity = (150 - increase) / 120;
            }, 8);
        }, 70);
        $body.appendChild($elem);
    };
};