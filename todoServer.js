const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());

app.post("/delete", function (req, res) {
    deleteTodo(req.body.taskIndex, function (err) {
        if (err) {
            res.status(500).send("error");
            return;
        }
        res.status(200).send("success");
    }); 
});

app.post("/update", function (req, res) {
    updateTodo(req.body, function (err) {
        if (err) {
            res.status(500).send("error");
            return;
        }
        res.status(200).send("success");
    }); 

});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/todoViews/index.html");
});
app.get("/todo", function (req, res) {
    readDatabase(function (err, data) {
        if (err) {
            res.status(500).send("error");
            return;
        }
        res.status(200).send(JSON.stringify(data));
    })
})

app.post("/todo", function (req, res) {
    saveDatabase(req.body, function (err) {
        if (err) {
            res.status(500).send("error");
            return;
        }
        res.status(200).send("success");
    });
});

app.get("/clientScript.js", function (req, res) {
    res.sendFile(__dirname + "/todoViews/clientScript.js");
});

app.listen(5000, function () {
    console.log("Server is listening on port 5000...");
});

function readDatabase(callback) {
    fs.readFile("./assign9/myDatabase.txt", "utf-8", function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        if (data.length === 0) {
            data = "[]";
        }

        try {
            data = JSON.parse(data);
            callback(null, data);
        } catch (err) {
            callback(err);
        }
        
    });
}
function saveDatabase(todo, callback) {
    readDatabase(function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        data.push(todo);
        fs.writeFile("./assign9/myDatabase.txt", JSON.stringify(data), function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    });

}
function deleteTodo(index, callback) {
    readDatabase(function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        data.splice(index, 1);
        fs.writeFile("./assign9/myDatabase.txt", JSON.stringify(data), function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    });

}
function updateTodo(msg, callback) {
    readDatabase(function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        data[msg.taskIndex].status = msg.status;
        fs.writeFile("./assign9/myDatabase.txt", JSON.stringify(data), function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    });

}


