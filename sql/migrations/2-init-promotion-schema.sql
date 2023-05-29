-- PromotionType Enum
CREATE TYPE PromotionType AS ENUM ('buyNForM', 'buyXGetYFree', 'buyXForPriceOfY', 'buyMoreThanXForYDiscount');

-- Base PromotionRules table
CREATE TABLE PromotionRules
(
    sku  VARCHAR(255) PRIMARY KEY REFERENCES products (sku) ON DELETE CASCADE,
    type PromotionType NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- DiscountType Enum
CREATE TYPE DiscountType AS ENUM ('percentage', 'fixed');

-- BuyNForMPromotion table
CREATE TABLE BuyNForMPromotions
(
    sku  VARCHAR(255) PRIMARY KEY REFERENCES PromotionRules (sku) ON DELETE CASCADE,
    n   INT          NOT NULL,
    m   INT          NOT NULL,
    CHECK (m > 0)
);

-- BuyXGetYFreePromotion table
CREATE TABLE BuyXGetYFreePromotions
(
    sku          VARCHAR(255) PRIMARY KEY REFERENCES PromotionRules (sku) ON DELETE CASCADE,
    freeItemSku VARCHAR(255) NOT NULL,
    qty         INT          NOT NULL,
    CHECK (qty > 0)
);

-- BuyXForPriceOfYPromotion table
CREATE TABLE BuyXForPriceOfYPromotions
(
    sku  VARCHAR(255) PRIMARY KEY REFERENCES PromotionRules (sku) ON DELETE CASCADE,
    x   INT          NOT NULL,
    y   INT          NOT NULL,
    CHECK (x > y AND y > 0)
);

-- BuyMoreThanXForYDiscountPromotion table
CREATE TABLE BuyMoreThanXForYDiscountPromotions
(
    sku           VARCHAR(255) PRIMARY KEY REFERENCES PromotionRules (sku) ON DELETE CASCADE,
    qty          INT           NOT NULL,
    discountType DiscountType  NOT NULL,
    discount     DECIMAL(5, 2) NOT NULL,
    CHECK (qty > 0 AND discount > 0)
);