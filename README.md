# dogs vs cat web UI
This is a practice project in order to learn how to deploy a pretrained transformer models as an API using Flask and build a simple web UI using Next.js


### Screenshots
![Screenshot from 2024-06-22 15-12-23](https://github.com/JohnEsleyer/dogs-vs-cats-web-UI/assets/66754038/0882d80c-fb6d-4939-8958-2550f53301da)


### Setup
<p>(Note that this project was built in linux. I'm not sure the same process applies to other operating systems such as windows)</p>

Install the python dependencies
```
pip3 install -r requirements.txt
```

Run the API in production server
```
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

In the web directory, run the following command
```
npm run dev
```
