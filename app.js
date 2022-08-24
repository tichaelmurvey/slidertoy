console.log('running');
$(document).ready(function(){

    //Listen for changes in the RGB input
    $(".rgb-input").on("input", function(){
        updateColorFromRGB($(this).val(), $(this).parent());
    });
    //Listen for changes in the LCH input
    $(".lch-input").on("input", function(){
        updateColorFromLCH($(this).parent());
    });
    //Set default values
    $("#color-one-input").val("255, 0, 0");
    $("#color-two-input").val("0, 255, 0");
    $("#color-three-input").val("0, 0, 255");
    updateColorFromRGB($("#color-one-input").val(), $("#color-one-input").parent());
    updateColorFromRGB($("#color-two-input").val(), $("#color-two-input").parent());
    updateColorFromRGB($("#color-three-input").val(), $("#color-three-input").parent());

    
});

//Update input fields

function updateColorFromRGB(color_string, container){
    let rgb_values = color_string.split(",");
    if(chroma.valid(rgb_values)){
        let new_color = chroma(rgb_values);
        //Update display colour
        container.find(".preview").css({"background-color": "rgb("+new_color.rgb()+")"});
        //Update LCH fields
        new_lch = new_color.lch();
        container.find(".lightness").val(Math.round(new_lch[0]));
        container.find(".chroma").val(Math.round(new_lch[1]));
        container.find(".hue").val(Math.round(new_lch[2]));
        updateLuminance(new_color, container);
        checkCompliance()
    }
}

function updateColorFromLCH(container){
    console.log("updating from lch");
    let lch_values = [Number(container.find(".lightness").val()), Number(container.find(".chroma").val()), Number(container.find(".hue").val())];
    console.log(lch_values);
    let new_color = chroma(lch_values, 'lch');
    console.log("new color: " + new_color);
    //Update display colour
    container.find(".preview").css({"background-color": "rgb("+new_color.rgb()+")"});
    //Update RGB fields
    container.find(".rgb-input").val(new_color.rgb());
    updateLuminance(new_color, container);
    checkCompliance()
}

function updateLuminance(new_color, container){
    container.find('.luminance').text(Math.round(new_color.luminance()*100)/100);
}

function checkCompliance(){
    containers = $(".color");
    containers.each(function(index){
        $(this).find(".error").empty();
        let my_color = getColorFromObject($(this).find(".rgb-input"));
        let colors = [getColorFromObject($("#color-one-input")), getColorFromObject($("#color-two-input")), getColorFromObject($("#color-three-input"))];
        for(i=0; i<colors.length; i++){
            if(index != i){
                let ratio = chroma.contrast(my_color, colors[i]);
                if(ratio < $("#ratio").val()){
                    console.log("error on color " + index + " against color " + i);
                    console.log($(this));
                    $(this).find(".error").append("<p>Not compliant with color " + (i+1) + ". Ratio of " + ratio + ".</p>");
                }
            }
        }
    });
}

function getColorFromObject(color_object){
    let color_string = color_object.val();
    let rgb_values = color_string.split(",");
    return(chroma(rgb_values));
}