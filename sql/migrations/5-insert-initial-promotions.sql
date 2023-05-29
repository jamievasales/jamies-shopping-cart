-- Each sale of a MacBook Pro comes with a free Raspberry Pi B
INSERT INTO promotionrules (sku, type)
VALUES ('43N23P', 'buyXGetYFree');

INSERT INTO buyxgetyfreepromotions (sku, freeitemsku, qty)
VALUES ('43N23P', '234234', 1);

-- Buy 3 Google Homes for the price of 2
INSERT INTO promotionrules (sku, type)
VALUES ('120P90', 'buyXForPriceOfY');

INSERT INTO buyxforpriceofypromotions (sku, x, y)
VALUES ('120P90', 3, 2);

-- Buying more than 3 Alexa Speakers will have a 10% discount on all Alexa speakers
INSERT INTO promotionrules (sku, type)
VALUES ('A304SD', 'buyMoreThanXForYDiscount');

INSERT INTO buymorethanxforydiscountpromotions (sku, qty, discounttype, discount)
VALUES ('A304SD', 3, 'percentage', 10);

