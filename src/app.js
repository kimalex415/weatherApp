const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather',
		name: 'Alex Kim'
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Me',
		name: 'Alex Kim'
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		helpText: 'hello from help',
		title: 'Help',
		name: 'Alex Kim'
	});
});

app.get('/weather', (req, res) => {
	console.log(req.query.address)
	if (!req.query.address) {
		return res.send({
			error: 'You must provide an address!'
		})
	}

	geocode(req.query.address, (error, {
		latitude,
		longitude,
		location
	} = {}) => {
		if (error) {
			return res.send({
				error
			})
		}
		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({
					error
				})
			}
			res.send({
				forecast: forecastData,
				location: location,
				address: req.query.address
			});
		})
	})


});

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term'
		})
	}

	res.send({
		products: []
	})
})

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Alex Kim',
		notFound: 'Help Article not found'
	});
});

// 404 page. Should always be at the end.
app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Alex Kim',
		notFound: 'Page not Found'
	});
});

app.listen(3000, () => {
	console.log('Server is up on port 3000');
});