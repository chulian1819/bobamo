module.exports = [
{
    name:'Hidden'
},
{   name:'Boolean',
    types:['String', 'Number', 'Boolean'],
    schema:{
        trueDisplay:{type:'Text', placeholder:'true' },
        falseDisplay:{type:'Text', placeholder:'false'}
    }
},
{   name:'Date',
    types:['Date', 'Number', 'String'],
    schema:{
        format:{
            type:'Text',
            help:'See <a target="_blank" href="http://momentjs.com">momentjs</a> for information on formatting'
        }
    },
    defaults:{
        format:"MMMM Do YYYY, h:mm:ss a"
    }
},
{   name:'DateTime',
    ref:'renderer/Date',
    defaults:{
        format:'HH:MM dd/mm/yyy'
    }
},
{
    name:'Password',
    types:['String']
},
{
    name:'Multiple',
    types:['List'],
    schema:{
        itemType:{
            type:'Select',
            multiple:false,
            collection:'renderer/admin/collection',
            refresh:true,
            help:'Select a renderer for renderering each item'
        },
        number:{
            type:'Integer',
            help:'The number of items to show before ellipsing...'
        }
    }
},
{   name:'Number',
    types:['Number', 'String'],
    schema:{
        format:{ type:'Text', placeholder:"###.##", help:'See <a  target="_blank" href="http://numeraljs.com/">numeraljs</a> for help with formatting numbers' }
    }
}]