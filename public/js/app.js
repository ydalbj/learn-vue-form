
class Errors
{
    constructor() {
        this.errors = {};
    }

    has(field) {
        return this.errors.hasOwnProperty(field);
    }

    any() {
        return Object.keys(this.errors).length > 0;
    }

    get(field) {
        if (this.errors[field]) {
            return this.errors[field][0];
        }
    }

    record(errors) {
        this.errors = errors;
    }

    clear(field) {
        if (field) {
            delete this.errors[field];
            return;
        }

        this.errors = {};
    }
}

class Form
{
    constructor (data) {
        this.orginalData = data;

        for (let field in data) {
            this[field] = data.field
        }

        this.errors = new Errors();
    }

    data() {
        let data = Object.assign({}, this);

        delete data.orginalData;
        delete data.errors;
        return data;
    }

    submit(requestType, url) {
        axios[requestType](url, this.data())
            .then(this.success.bind(this))
            .catch(this.fail.bind(this));
    }

    success(response) {
        alert(response.data.message);
        this.errors.clear();
        this.reset();
    }

    fail(error) {
        this.errors.record(error.response.data);
    }

    reset() {
        for (let field in this.orginalData) {
            this.field = '';
        }
    }
}
new Vue({
    el: '#app',
    data: {
        form: new Form({
            name: '',
            description: ''
        })
    },
    methods: {
        onSubmit() {
            this.form.submit('post', '/projects')
        }
    }
});