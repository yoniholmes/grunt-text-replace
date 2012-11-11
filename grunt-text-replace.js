


/*text_replace: {

  files: ['../id_root/pages//*.shtml'],

  options: {
    type: 'regex' | 'fuzzy' | 'template' | 'icon' | 'default'
  },

  replacements: [
    {
      from: '1_1_2_File_Name.shtml', 
      to: '1_1_2_File_Name.html' 
    }, 
    {
      from: '*.shtml',
      to: '*.html',  
      type: 'fuzzy' 
    }, 
    {
      from: '([0-9])_([0-9])_([0-9])_(File_Name).shtml',
      to: '\1.\2.\3-\4.html' 
    }, 
    {
      from: '([0-9])_([0-9])_([0-9])_(File_Name).shtml',
      to: function (original, matches) {
        return Math.random();
      } 
    }, 
    {
      from: '1_1_2_(File_Name).shtml', 
      to: '\1 <% grunt.template.time('HH') %>.html'       
    }
  ]

}


{ from: '1_1_2_File_Name.shtml'
, to: '1_1_2_File_Name.html' 
},
{ from: '*.shtml'
, to: '*.html'
, type: 'fuzzy'
},


*/