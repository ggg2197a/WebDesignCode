Vue.component('joke-footer-2',{
	props: ['year','name'],
	template: `<footer class="muted" style="text-align:center">
		   &copy; {{ year }} {{ name }}
		   </footer>`
});

Vue.component('joke-display',{
	props: ['question','answer'],
    template: `<div>
    <p><b>{{ question }}</b></p>
    <p><i>{{ answer }}</i></p>
    </div>`
});