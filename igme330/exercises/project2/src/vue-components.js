Vue.component('header-display',{
	props: ['title'],
    template: `<div>
    <h1>{{ title }}</h1>
    <p>Hello, and welcome to the Yu-Gi-Oh! Card to Melody Generator!</p>
    <p>This app will take a random (or searched!) Yu-Gi-Oh! card and translate it procedurally into music.</p>
    <p>Press the Random Card button to check it out right away!</p>
    <p>If you don't know Yu-Gi-Oh! too well, try these cards!</p>
    <ul>
        <li><b>Dark Magician</b></li>
        <li><b>Blue-Eyes White Dragon</b></li>
        <li><b>Toon World</b></li>
        <li><b>Stardust Dragon</b></li>
    </ul>
    </div>`
});

Vue.component('card-display',{
	props: ['name'],
    template: `<div>
    <h2>{{ name }}</h2>
    </div>`
});