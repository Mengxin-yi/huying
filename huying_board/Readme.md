# Color
- Active 007aff
- Inactive 7a7e83

# Cache
- Objects are depending on JSON serialization.
```
- [classListChannel]
- [profile]
```

# Gearing
- Vue HMR detection.
```
document.querySelector('.grid-item-box._gear').offsetLeft === 26
else
document.querySelector('.grid-item-box._gear').offsetLeft === -15
```

# Log
```
// uni.showModal({ content: '打印信息', showCancel: false, success: (res) => { } });
```

```
setTimeout(() => {
	var keys = '';
	Object.keys(WeixinJSBridge).forEach(e => keys += e + ',');
	uni.showModal({ content: keys, showCancel: false, success: (res) => { } });
}, 1000);
```

```
createdWxSdkScript(() => {
	setTimeout(() => {
		var keys = '';
		Object.keys(wx).forEach(e => keys += e + ',');
		uni.showModal({ content: wx.updateAppMessageShareData === undefined, showCancel: false, success: (res) => { } });
	}, 1000);
});
```

# Git

## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin http://gitlab.ugoolink.com/liuhaihui/huying_board
git branch -M main
git push -uf origin main
```
