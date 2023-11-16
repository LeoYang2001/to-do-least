import { hexColorWithOpacity } from "./util"
import * as Icon from 'react-native-feather'
import Ionicons from '@expo/vector-icons/Ionicons';



export default todoThemeColor = {
    fontColor:'#3D4166',
    primaryColor: "#FEF3D5",
    secondaryColor:"#E87159",
    configColor:hexColorWithOpacity('#4d4d4d',50),
    configColorWithoutOpacity : '#333333',
    alertColor:'#e60000',
    fontFamily:'Avenir'
}

const underDevelopAlert = 'Sorry, this feature is currently under development. We appreciate your patience and will notify you once it becomes accessible.'

const colorList = [
    "#FEF3D5",
    '#80aaff',
    '#80ff80',
    '#ff99ff',
    "#e066ff",
    "#ff66a3",
    "#79d2a6",
    "#660033",
    "#e60073"
]

const iconList = [
    {
        iconId:1,
        iconName:'Briefcase'
    },
    {
        iconId:2,
        iconName:'ShoppingCart'
    },
    {
        iconId:3,
        iconName:'Clipboard'
    },
    {
        iconId:4,
        iconName:'PenTool'
    }
]

const importanceLevelList = [
    {
        id:1,
        level:'casual',
        icon:(size)=>(
            null
        )
    },
    {
        id:2,
        level:'moderate',
        icon:(size)=>(
            <Icon.Bookmark color={'yellow'} fill={'yellow'} width={size}/>
        )
    },
    {
        id:3,
        level:'critical',
        icon:(size)=>(
            <Ionicons name="alert-outline" size={size} color={'red'} />
        )
    },
    
]

const init_tasks = [
    // {
    //   id:1,
    //   task:"Buy groceries",
    //   importanceLevel:2,
    //   deadLine: new Date().toDateString(),
    //   ifDone:false,
    // },
    // {
    //   id:2,
    //   task:"Work out",
    //   importanceLevel:2,
    //   deadLine: new Date().toDateString(),
    //   ifDone:false,
    // },
    // {
    //   id:3,
    //   task:"Do laundry",
    //   importanceLevel:1,
    //   deadLine: new Date().toDateString(),
    //   ifDone:false,
    // }
  ]


export {iconList , colorList, init_tasks, importanceLevelList, underDevelopAlert}