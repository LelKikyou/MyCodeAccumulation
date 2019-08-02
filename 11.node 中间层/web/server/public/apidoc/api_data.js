define({ "api": [
  {
    "type": "post",
    "url": "/login",
    "title": "获取用户信息",
    "description": "<p>获取用户信息</p>",
    "name": "login",
    "group": "Login",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>用户名</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "age",
            "description": "<p>年龄</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "user",
            "description": "<p>返回user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"user\":\"\"}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://localhost:3001/api/sdcm/login"
      }
    ],
    "version": "1.0.0",
    "filename": "routes/api/login.js",
    "groupTitle": "Login"
  }
] });
