// import AsyncStorage from "@react-native-community/async-storage"

export function getDBData({realm, subject, filters}){//获取db中的聊天记录
    let data = realm.objects(subject);
    if(filters){
      data = data.filtered('text CONTAINS "'+filters+'"');
    }
    // data.map(item=>console.log(item))
    return data;
}
export function mapping(subject){//中文学科名对应的英文，用于请求
    const subjectMap = {
      "语文": "chinese",
      "数学": "math",
      "英语": "english",
      "生物": "biology",
      "历史": "history",
      "地理": "geo",
      "政治": "politics",
      "物理": "physics",
      "化学": "chemistry",
    }
    return subjectMap[subject]
}

export function decodeSearchResult(datas){
    let dialogs = [];
    for (let {type, text, id, idx} of datas) {
      dialogs.push({type, text, id, idx})
    }
    return dialogs;
}

// export async function getToken(){
//     let res
//     try {
//         const value = await AsyncStorage.getItem('token');
//         if (value != null) {
//           res = value
//           console.log('val:'+res)

//         }
//         else{
//             console.log('token')
//             console.log('val:'+res)

//             let data = await fetch('https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=YEttbYGrGUBem5GKAz21D812&client_secret=We5r6044RZz9n5AD1ZQxGjyC7cY5pysU')
//             res = (await data.json());
//             console.log(res)
//             await AsyncStorage.setItem('token', res.access_token);
//         }
//     } catch (error) {
//         // Error retrieving data
//         console.error(error)
//     }
//     return res
// }

export function fetchWithTimeout(fetch, timeout=10000){//封装fetch，添加timeout
    return Promise.race([
      fetch,
      new Promise((resolve, reject)=>{
        let timer = setTimeout(() => {
          reject('fetch timeout!')
        }, timeout);
      })
    ])
}

// export function checkToken(){

// }