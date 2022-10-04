



export default function generate_uc(gm)
{
    const date = new Date().toLocaleDateString().split("/")
    const date2 = new Date()

    let m = Number(date[0])
    let d = Number(date[1])
    
    let h = Number(date2.getHours())
    let r = Number(date2.getHours())
    
    if(r - 26>0){
        r -= 26
        h += r/60
    }

    if(h - 26>0){
        h -= 26
        d += r/24
    }
    

    if(d - 26>0){
        d -= 26
        m += d/30
    }

    return gm + randl() + convert([d,m]) +  randl() + convert([h,r])
}

function convert(num){

    //adds 64 a
    let s = [...num].map(e=>Number(e)+64)

    //converts num to char
    return String.fromCharCode(...s)
}


function randl()
{
    return convert([Math.random()*25+1])
}