/** @format */

const transporter = require("../supports/nodemailer.js");
const db = require("../database/users.js");
const { default: validator } = require("validator");
const fs = require("fs");

const handlebar = require("handlebars");


const hashing = require("../supports/hash.js");

const Register = (req, res) => {
	// Get all data value
	const data = req.body; // {email,password}
	// validasi data

	// if(data.email && data.password){
	//     if(!(validator.isEmail(data.email))){
	//         res.status(406).send({
	//             error : true,
	//             message : "Email Format Wrong"
	//         })
	//     }

	//     if(data.password.length < 8){
	//         res.status(406).send({
	//             error : true,
	//             message : "Password too short"
	//         })
	//     }

	//     res.send('success')

	// }else{
	//     res.status(406).send({
	//         error : true,
	//         message : "data not complete (username or password)"
	//     })
	// }

	try {
		// validasi data
		if (!data.email || !data.password) throw "Data not complete";
		if (!validator.isEmail(data.email)) throw "Email format wrong";
		if (data.password.length < 8) throw "password too short (min 8 char)";

		//cek data.email with database if already exsited send notif email already exist
		let sql = "select * from users where email=?";
		db.query(sql, data.email, (err, result) => {
			try {
				if (err) throw err

				if (result.length === 0) {

					try {
						const afterHashing = hashing(data.password);
						data.password = afterHashing;
					} catch (error) {
						res.status(500).json({
							error: true,
							message: "failed to hash password"
						});
					}
					db.query("insert into users set ?", data, (err, result) => {
						try {
							if (err) throw err;
							console.log(result);

							// send email
							fs.readFile(
								"D:/Purwadhika/backend/authsystem/backend/template/emailtemplate.html",

								{ encoding: "utf-8" },
								(err, file) => {
									if (err) throw err;
									const template = handlebar.compile(file);
									const resulttemp = template({
										email: data.email,
										link: "http://localhost:3000/verification/" + result.insertId + "/" + data.password + "/" + "a",
										text1: "this is description",
										text2: "this is description2"
									});
									transporter
										.sendMail({
											from: "toko  al-amin",
											to: data.email,
											subject: "email confirmation",
											html: resulttemp
										})
										.then(respons => {
											res.status(200).send({
												error: false,
												message: "Register Success, please check your mail to confirm !!"
											});
										})
										.catch(err => {
											res.status(500).send({
												error: true,
												message: err.message
											});
										});
								}
							);
						} catch (error) {
							res.status(500).send({
								error: true,
								message: error.message
							});
						}
					});
				} else {
					res.json({
						error: true,
						message: "email already exist"
					})


				}
			} catch (err) {
				res.status(406).send({
					error: true,
					message: err
				});
			}
		});

		// hash password

		// store data to db
	} catch (err) {
		res.status(500).send({
			error: true,
			message: error
		});
	}

	// hash password data
	// store data ke db
	// kirim email
};

const Login = (req, res) => {
	const data = req.body;

	try {
		if (!data.email || !data.password) throw "Data not complete";
		if (!validator.isEmail(data.email)) throw "Email format wrong";
		if (data.password.length < 8) throw "password too short (min 8 char)";

		try {
			const passwordHashed = hashing(data.password);
			data.password = passwordHashed;
		} catch (error) {
			res.status(500).send({
				error: true,
				message: "failed to hash password"
			});
		}

		let sql = "select * from users where email=? and password=?";

		db.query(sql, [data.email, data.password], (err, result) => {
			try {
				if (err) throw err;
				if (result.length === 0) throw "email or password wrong";
				if (result[0].is_email_confirm === 0) throw "please verify your email"

				res.status(200).send({
					error: false,
					message: "login success",
					data: {
						id: result[0].id,
						email: result[0].email,
						created_at: result[0].created_at,
						is_email_confirm: result[0].is_email_confirm
					}
				});
			} catch (error) {
				res.send({
					error: true,
					message: error
				});
			}
		});
	} catch (error) {
		res.send({
			error: true,
			message: error
		});
	}
};

const sendMail = (req, res) => {
	const mailOptions = {
		from: "firman hadi yudistia",
		to: "yudistia.fireman28@gmail.com",
		subject: "Verify your email now !!!!",
		html: "<h1>Hello, Please Verify your email <a href='www.google.com'>here</a>"
	};

	transporter
		.sendMail(mailOptions)
		.then(val => {
			console.log(val);
			res.json({
				error: false,
				message: "Email successfully sent"
			});
		})
		.catch(err => {
			console.log(err);
		});
};

const verifyEmail = (req, res) => {
	const data = req.params





	let sql = "update users set is_email_confirm=1 where id=? and password=? ";
	db.query(sql, [data.id, data.password], (err, result) => {
		try {
			if (err) throw error;
			res.status(201).send({
				error: false,
				message: "email has been verified"
			});
		} catch (error) {
			res.send({
				error: true,
				message: err.message
			});
		}
	});




};

const getUserById = (req, res) => {
	let id = req.params.id
	let sql = "select * from users where id=?"
	db.query(sql, id, (err, result) => {
		try {
			if (err) throw err
			res.status(200).send({
				error: false,
				data: result
			})
		} catch (error) {
			res.status(406).send({
				error: true,
				message: error
			})
		}
	})

}

module.exports = {
	Register: Register,
	Login: Login,
	sendMail: sendMail,
	verifyEmail: verifyEmail,
	getUserById: getUserById
};
