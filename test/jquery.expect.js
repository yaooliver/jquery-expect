function alias (fn) {
  var b = $expect('body');
  for (var i = 1; i < arguments.length; i++) {
    try {
      expect(b[fn]).to.be(b[arguments[i]]);  
    } catch (e) {
      throw new Error('wrong alias ' + arguments[i])
    }
    
  }
}

function err (fn, msg) {
  try {
    fn();
    throw new Error('Expected an error');
  } catch (err) {
    expect(msg).to.be(err.message);
  }
}

describe('$expect', function () {

  it('should test exist', function () {
    $expect('#mocha').to.exist();
    $expect('foobar').not.to.exist();

    err(function () {
      $expect('foobar').to.exist();
    }, 'expected foobar to exist');

    err(function () {
      $expect('#mocha').not.to.exist();
    }, 'expected #mocha not to exist');

    err(function () {
      $expect('foobar').to.exist('foo my bar');
    }, 'foo my bar');
  });

  it('should test for length', function () {
    // Check alias
    alias('items', 'length', 'elements');

    $expect('#mocha').to.have.items(1);
    $expect('#mocha').not.to.have.items(4);
    $expect('#four-list li').to.have.items(4);

    err(function () {
      $expect('#four-list li').not.to.have.items(4);
    }, 'expected #four-list li to not have a length of 4');

    err(function () {
      $expect('#four-list li').not.to.have.items(4, 'foo my bar');
    }, 'foo my bar');

  });

  it('should test for above', function () {
    alias('above', 'greaterThan');
    
    $expect('#four-list li').to.be.above(2);
    $expect('#four-list li').not.to.be.above(4);

    err(function () {
      $expect('#four-list li').to.be.above(4);
    }, 'expected #four-list li to have a length greater than 4');

    err(function () {
      $expect('#four-list li').to.be.above(4, 'foo my bar');
    }, 'foo my bar');
  });

  it('should test for below', function () {
    alias('below', 'lessThan');

    $expect('#four-list li').to.be.below(5);
    $expect('#four-list li').not.to.be.below(4);

    err(function () {
      $expect('#four-list li').to.be.below(4);
    }, 'expected #four-list li to have a length less than 4');

    err(function () {
      $expect('#four-list li').to.be.below(4, 'blah');
    }, 'blah');
    
  });

  it('should test for equal', function () {
    alias('equal', 'eql');
    $expect('#four-list').to.be.eql('#four-list')
    $expect('#four-list').to.be.eql($('#four-list'));

    $expect('#four-list li').to.be.eql('li.item');
    $expect('#four-list').not.to.be.eql('li');

    err(function () {
      $expect('#four-list').not.to.be.eql('#four-list');
    }, 'expected #four-list to not equal #four-list');

    err(function () {
      $expect('#four-list').not.to.be.eql('#four-list', 'blah');
    }, 'blah');
  });

  it('should test for attr', function () {
    $expect('.link').to.have.attr('href', 'http://google.com');
    $expect('.link').not.to.have.attr('data-target', 'http://google.com');

    err(function () {
      $expect('.link').not.to.have.attr('href', 'http://google.com');
    }, 'expected .link to not have an attribute href equals to http://google.com');

    err(function () {
      $expect('.link').not.to.have.attr('href', 'http://google.com', 'blah');
    }, 'blah');
  });

  it('should test text', function () {
    $expect('.link').to.have.text('google');
    $expect('.link').to.have.text('Google.', true);

    err(function () {
      $expect('.link').to.have.text('foo')
    }, 'expected .link text to be equal to foo but got Google.')

    err(function () {
      $expect('.link').to.not.have.text('google', 'blah')
    }, 'blah');

    err(function () {
      $expect('.link').to.have.text('google', true, 'blah2')
    }, 'blah2');
  });

  it('should test dimensions (width, height)', function () {
    $expect('.dimensions').to.have.width(50);
    $expect('.dimensions').to.have.outerWidth(64);
    $expect('.dimensions').to.have.innerWidth(60);

    $expect('.dimensions').to.have.height(50);
    $expect('.dimensions').to.have.outerHeight(64);
    $expect('.dimensions').to.have.innerHeight(60);
  });
  
  it('should test for html, val', function () {
    $expect('.html').to.have.html('<a>XX</a><p>YY</p>');
    err(function () {
      $expect('.html').not.to.have.html('<a>XX</a><p>YY</p>');
    }, 'expected .html not to have a html of <a>XX</a><p>YY</p>');
    err(function () {
      $expect('.html').not.to.have.html('<a>XX</a><p>YY</p>', 'blah');
    }, 'blah');
    
    $expect('.val').to.have.val('myval');
    err(function () {
      $expect('.val').not.to.have.val('myval', 'blah');
    }, 'blah');
  });

  // HOW TO TEST SCROLLTOP / LEFT ?

  it('should test traversal', function () {
    $expect('.parent').to.have.children('.child');
    $expect('.parent').to.contain('.child');

    err(function () {
      $expect('.parent').to.have.children('blah');  
    }, 'expected .parent to have children blah');

    err(function () {
      $expect('.parent').to.have.children('blah', 'blah');  
    }, 'blah')
    

    $expect('.child').to.have.parent('.parent');
    $expect('.child').to.have.parents('.parent');
    $expect('.child').to.have.closest('.parent');

    $expect('.child').to.not.have.parentsUntil('.parent');
    $expect('.child').to.have.parentsUntil('body');

    $expect('.abs').to.have.offsetParent('.parent');

    $expect('.order-list').to.have.children('li');
    $expect('.order-list li.first').to.have.siblings('li');
    $expect('.order-list li.first').to.have.next('.second');
    $expect('.order-list li.first').to.have.nextAll('.fourth');
    $expect('.order-list li.first').to.have.nextUntil('.fourth');
    $expect('.order-list li.first').to.not.have.nextUntil('.second');
    
    $expect('.order-list li.third').to.have.prev('.second');
    $expect('.order-list li.third').to.have.prevAll('.first');
    $expect('.order-list li.third').to.have.prevUntil('.first');
    $expect('.order-list li.third').to.not.have.prevUntil('.second');

  });

  it('should test and', function () {
    $expect('.child').to.have.parent('.parent')
                 .and.to.have.parents('.parent')
                 .and.to.have.closest('.parent');
  });

  it('should test that, end', function () {
    $expect('.parent').to.have.children('.child')
                        .that.has.children('.abs')
                          .that.has.text('a').end().end()
                      .to.be.a('.parent');
  });

  it('should test css', function () {
    $expect('.red').to.have.css('color', '#FF0000')
                    .and.have.css('color', 'red')
                    .and.have.css('color', 'rgb(255,0,0)');

    $expect('.padder').to.have.css('padding', '1px 2px 3px 4px');
    $expect('.padder').to.have.css('margin', '1px 2px 3px 4px');
    $expect('.padder').to.have.css('border', '1px solid red');

    $expect('.half-pad').to.have.css('padding', '1px 2px');
    $expect('.half-pad').to.have.css('margin', '1px 2px');
    $expect('.half-pad').to.have.css('border-style', 'dashed solid double dotted');

    $expect('.pad').to.have.css('padding', '10px');
    $expect('.pad').to.have.css('margin', '10px');

    err(function () {
      $expect('.padder').to.have.css('padding', '1px 2px 3px 5px');
    }, 'expected .padder to have its padding style equal to 1px 2px 3px 5px but got 1px 2px 3px 4px');
  

  });

});
