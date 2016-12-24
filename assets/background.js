function getSeedTime() {
    // this function should return same string for an hour
    var date = new Date();
    return date.toDateString() + ' ' + date.getHours();
}

function changeBackground() {
    var pattern = Trianglify({
        seed: getSeedTime(),
        x_colors: 'Spectral',
        y_colors: 'random',
        width: window.innerWidth,
        height: $(document).height() + 100
    });

    // umm yeah, hacks, who does not love them?!
    document.body.style.backgroundImage = 'url('+ pattern.png() + ')';
}

$(window).resize(
    _.debounce(changeBackground, 2000)
);
