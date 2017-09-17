function getSeed() {
    // Seed function - currently it should return unique background per url.

    // var date = new Date();
    // return date.toDateString() + ' ' + date.getHours();

    return window.location.href

}

function changeBackground() {
    var pattern = Trianglify({
        seed: getSeed(),
        x_colors: 'Spectral',
        y_colors: 'random',
        width: min(3000, window.innerWidth),
        height: min(6000, $(document).height() + 100)
    });

    // umm yeah, hacks, who does not love them?!
    document.body.style.backgroundImage = 'url('+ pattern.png() + ')';
}

$(window).resize(
    _.debounce(changeBackground, 2000)
);
