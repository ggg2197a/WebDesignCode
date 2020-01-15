let app = new Vue({
	el: '#root',
	data: {
		newName: "",
        names: ["Adam","Betty","Charlie","Doris"],
        title: "Guest List"
	},
	methods:{
		addName(){
			if (!this.newName) return;
			this.names.push(this.newName);
			this.newName = "";
		}
	}
});