"""
Agent Knowledge Base
=====================
A structured, curated knowledge base that gives every LLM agent
the domain expertise of a senior data scientist.

Instead of relying solely on the LLM's parametric knowledge,
we inject VERIFIED, PRECISE statistical and ML knowledge directly
into agent prompts. This eliminates hallucinated API signatures,
wrong test selections, and incorrect formula interpretations.

Structure:
- STATISTICS_KB   : Statistical test selection, assumptions, effect sizes
- EDA_KB          : Exploratory data analysis best practices
- PANDAS_KB       : Verified pandas idioms and common pitfalls
- SKLEARN_KB       : scikit-learn patterns for clustering, preprocessing
- DATA_QUALITY_KB : Data cleaning rules and imputation strategies
- REPORTING_KB    : How to report statistical findings correctly
"""

# ─── Statistics Knowledge Base ────────────────────────────────────────────────

STATISTICS_KB = """
# STATISTICAL TESTS REFERENCE (Verified, Production-Grade)

## Test Selection Decision Tree

### Comparing Two Groups (Numeric outcome)
- IF both groups normal (Shapiro-Wilk p > 0.05) AND n > 30:
    → Welch's t-test: scipy.stats.ttest_ind(a, b, equal_var=False)
    → Effect size: Cohen's d = (mean_a - mean_b) / pooled_std
- IF non-normal OR n < 30:
    → Mann-Whitney U: scipy.stats.mannwhitneyu(a, b, alternative='two-sided')
    → Effect size: rank-biserial r = 1 - (2*U)/(n1*n2)

### Comparing 3+ Groups (Numeric outcome)
- IF all groups normal AND equal variance (Levene p > 0.05):
    → One-way ANOVA: scipy.stats.f_oneway(*groups)
    → Post-hoc: statsmodels.stats.multicomp.pairwise_tukeyhsd
    → Effect size: eta-squared η² = SS_between / SS_total
- IF non-normal:
    → Kruskal-Wallis: scipy.stats.kruskal(*groups)
    → Post-hoc: scipy.stats.mannwhitneyu (pairwise, BH corrected)

### Correlation (Two numeric variables)
- IF both normal: Pearson r = scipy.stats.pearsonr(x, y)
    → Interpretation: |r| < 0.3 weak, 0.3-0.5 moderate, > 0.5 strong
- IF non-normal OR ordinal: Spearman ρ = scipy.stats.spearmanr(x, y)
- IF ranked data: Kendall τ = scipy.stats.kendalltau(x, y)

### Two Categorical Variables
- IF expected cell counts ≥ 5: Chi-square = scipy.stats.chi2_contingency
    → Effect size: Cramér's V = sqrt(chi2 / (n * (min(r,c) - 1)))
- IF expected cell counts < 5 OR 2x2 table:
    → Fisher's Exact: scipy.stats.fisher_exact
    → Effect size: Odds Ratio

### One Categorical vs One Numeric (Paired)
- IF normal: Paired t-test: scipy.stats.ttest_rel(before, after)
- IF non-normal: Wilcoxon signed-rank: scipy.stats.wilcoxon(before, after)

## Multiple Comparisons Correction
- Benjamini-Hochberg FDR: statsmodels.stats.multitest.multipletests(pvalues, method='fdr_bh')
    → Controls False Discovery Rate (proportion of false positives among rejections)
    → PREFERRED over Bonferroni for exploratory analysis
- Bonferroni: alpha_corrected = alpha / n_tests
    → Use for confirmatory analysis with few tests

## Effect Size Interpretation
| Metric        | Negligible | Small | Medium | Large |
|---------------|-----------|-------|--------|-------|
| Cohen's d     | < 0.2     | 0.2   | 0.5    | 0.8   |
| Pearson r     | < 0.1     | 0.1   | 0.3    | 0.5   |
| Cramér's V    | < 0.1     | 0.1   | 0.3    | 0.5   |
| η² (eta-sq)  | < 0.01    | 0.01  | 0.06   | 0.14  |

## Assumption Checks
- Normality (n ≤ 5000): scipy.stats.shapiro(sample)  — p > 0.05 = normal
- Normality (n > 5000): scipy.stats.normaltest(data)  — p > 0.05 = normal
- Equal variance: scipy.stats.levene(a, b)  — p > 0.05 = equal variance
- Independence: context-dependent (cannot be tested statistically)

## CRITICAL RULES FOR REPORTING
1. ALWAYS report effect size alongside p-value — p-value alone is insufficient
2. NEVER say "proves" or "causes" — say "is associated with" or "differs significantly"
3. Statistical significance ≠ practical significance (a tiny effect can be p<0.001 with n=100000)
4. Report confidence intervals when possible: effect ± (1.96 * SE)
5. A non-significant result does NOT mean "no effect" — it means "insufficient evidence"
"""

# ─── EDA Knowledge Base ───────────────────────────────────────────────────────

EDA_KB = """
# EXPLORATORY DATA ANALYSIS (EDA) BEST PRACTICES

## Step 1: Data Overview
df.shape           # (rows, cols)
df.dtypes          # column data types
df.info()          # non-null counts + dtypes
df.describe()      # numeric summary stats
df.head()          # first 5 rows

## Step 2: Missing Value Analysis
df.isnull().sum()                    # count missing per column
df.isnull().mean() * 100             # % missing per column
# Decide strategy:
# < 5% missing  → drop rows OR mean/median imputation
# 5-30% missing → median/mode imputation OR model-based
# > 30% missing → consider dropping column

## Step 3: Distribution Analysis
# Numeric columns
skewness = df[col].skew()
# |skew| < 0.5: approximately symmetric
# 0.5 < |skew| < 1.0: moderately skewed
# |skew| > 1.0: highly skewed → consider log transform

# Outlier detection (IQR method)
Q1, Q3 = df[col].quantile(0.25), df[col].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR
outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]

## Step 4: Categorical Analysis
df[col].value_counts()                    # frequency table
df[col].value_counts(normalize=True)      # proportions
df[col].nunique()                         # cardinality

## Step 5: Correlation Analysis
# Pearson correlation matrix (numeric only)
corr_matrix = df.select_dtypes(include='number').corr()
# High correlation (|r| > 0.7) suggests multicollinearity
# For regression: check VIF

## Step 6: Bivariate Analysis
# Numeric vs Categorical
grouped_stats = df.groupby('category_col')['numeric_col'].agg(['mean','median','std','count'])
# Check if groups have sufficient sample size (n ≥ 30 per group recommended)

## COMMON EDA PITFALLS TO AVOID
1. Never remove outliers without domain knowledge justification
2. Never impute without understanding WHY data is missing (MCAR/MAR/MNAR)
3. Never standardize categorical variables before encoding
4. Never calculate correlation between a binary column and others using Pearson
   → Use point-biserial correlation: scipy.stats.pointbiserialr(binary, continuous)
5. Never interpret R² alone — always check residuals
"""

# ─── Pandas Knowledge Base ────────────────────────────────────────────────────

PANDAS_KB = """
# VERIFIED PANDAS IDIOMS (Production-Grade)

## Safe Column Access
# WRONG: df.column_name  (breaks if column has spaces or special chars)
# RIGHT:
df['column_name']                    # always use bracket notation

## Safe Type Checking
pd.api.types.is_numeric_dtype(df['col'])
pd.api.types.is_datetime64_any_dtype(df['col'])
pd.api.types.is_categorical_dtype(df['col'])

## Date Parsing (ALWAYS use errors='coerce')
df['date_col'] = pd.to_datetime(df['date_col'], errors='coerce')
# errors='coerce' converts unparseable dates to NaT instead of raising

## String Cleaning
df['col'] = df['col'].str.strip().str.lower()

## Groupby + Aggregation (safe pattern)
result = df.groupby('group_col', observed=True)['value_col'].agg(['mean', 'std', 'count'])
# observed=True prevents deprecation warning for categorical dtypes

## Filtering + Null Handling
# Extract two groups for comparison:
group_a = df[df['binary_col'] == df['binary_col'].unique()[0]]['metric_col'].dropna().values
group_b = df[df['binary_col'] == df['binary_col'].unique()[1]]['metric_col'].dropna().values

## Safe Numeric Conversion
df['col'] = pd.to_numeric(df['col'], errors='coerce')

## Correlation (handle missing values)
corr_val, p_val = scipy.stats.pearsonr(
    df['x'].dropna().align(df['y'].dropna(), join='inner')[0],
    df['x'].dropna().align(df['y'].dropna(), join='inner')[1]
)
# Use .align() to ensure x and y indices match after dropna()

## COMMON PANDAS BUGS TO AVOID
1. df[df['col'] == True] → WRONG; use df[df['col'].astype(bool)]
2. df.groupby('col').mean() → DEPRECATED in pandas 2.x; use df.groupby('col').mean(numeric_only=True)
3. df.append() → REMOVED in pandas 2.0; use pd.concat([df, new_row])
4. df.iterrows() is slow for large DataFrames; prefer vectorized operations
5. Chained indexing df[mask]['col'] = val → use df.loc[mask, 'col'] = val
6. String comparison is case-sensitive; always .str.lower() before comparing
"""

# ─── Scikit-learn Knowledge Base ──────────────────────────────────────────────

SKLEARN_KB = """
# SCIKIT-LEARN PATTERNS (Data Scientist Grade)

## Preprocessing
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder

# Standardize (mean=0, std=1) — use for distance-based algorithms
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

# Min-Max (0 to 1) — use when bounded range needed
scaler = MinMaxScaler()

# Encode categorical → integer (for tree models)
le = LabelEncoder()
df['encoded'] = le.fit_transform(df['categorical_col'])

# One-hot encoding (for linear models, neural nets)
df_encoded = pd.get_dummies(df['categorical_col'], drop_first=True)

## Train/Test Split
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y  # stratify for classification
)

## Feature Importance (Random Forest)
from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
importances = pd.Series(rf.feature_importances_, index=X.columns).sort_values(ascending=False)

## Clustering (K-Means)
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
# Find optimal k using silhouette score
for k in range(2, 10):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = km.fit_predict(X_scaled)
    score = silhouette_score(X_scaled, labels)

## Cross-Validation
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"CV Accuracy: {scores.mean():.3f} ± {scores.std():.3f}")
"""

# ─── Data Quality Knowledge Base ──────────────────────────────────────────────

DATA_QUALITY_KB = """
# DATA QUALITY & CLEANING RULES

## Missing Data Taxonomy
- MCAR (Missing Completely At Random): missing unrelated to any variable → safe to impute
- MAR (Missing At Random): missing related to OTHER observed variables → impute with model
- MNAR (Missing Not At Random): missing related to unobserved values → domain expert required

## Imputation Strategies
# Numeric: use MEDIAN for skewed distributions, MEAN for symmetric
df['col'].fillna(df['col'].median(), inplace=True)

# Categorical: use MODE
df['col'].fillna(df['col'].mode()[0], inplace=True)

# Time series: forward fill (carries last known value forward)
df['col'].fillna(method='ffill', inplace=True)

## Outlier Treatment Options
1. KEEP if outlier is valid (e.g., a billionaire in income data)
2. CAP (Winsorize): df['col'].clip(lower=Q1-1.5*IQR, upper=Q3+1.5*IQR)
3. REMOVE if data entry error (document the reason)
4. LOG TRANSFORM if positive and right-skewed: df['col_log'] = np.log1p(df['col'])

## Data Type Validation Rules
- Percentages must be 0-100 (or 0-1): assert df['pct_col'].between(0, 100).all()
- Ages must be positive: assert (df['age'] > 0).all()
- IDs must be unique: assert df['id_col'].nunique() == len(df)

## Duplicate Detection
exact_dups = df.duplicated().sum()               # exact duplicate rows
soft_dups = df.duplicated(subset=['name', 'email']).sum()  # key-based duplicates
"""

# ─── Statistical Reporting Knowledge Base ─────────────────────────────────────

REPORTING_KB = """
# STATISTICAL REPORTING STANDARDS (APA + Modern Practice)

## Correct Reporting Templates

### t-test result:
"A Welch's t-test indicated a statistically significant difference in 
[outcome] between [group A] (M=X, SD=Y) and [group B] (M=X, SD=Y),
t(df) = X.XX, p = 0.XXX (FDR-corrected), d = X.XX (medium effect)."

### Mann-Whitney U result:
"A Mann-Whitney U test revealed a significant difference in [outcome]
between groups, U = XXXX, p = 0.XXX (FDR-corrected), r = X.XX."

### Chi-square result:
"A chi-square test of independence showed a significant association 
between [var1] and [var2], χ²(df) = XX.XX, p = 0.XXX, V = X.XX."

### Pearson correlation:
"[Var1] was significantly positively/negatively correlated with [var2],
r(n) = X.XX, p = 0.XXX (FDR-corrected)."

### Non-significant result:
"No statistically significant association was found between [var1] and [var2],
[test](df) = X.XX, p = X.XX (FDR-corrected). The null hypothesis was retained."

## FORBIDDEN LANGUAGE (Statistical Misconduct)
NEVER write:
- "X causes Y" (correlation ≠ causation)
- "proves that" (statistics cannot prove — only support or fail to reject)
- "highly significant" (use effect size labels instead)
- "marginally significant" (a result is significant or not at the chosen alpha)
- "trend towards significance" (p = 0.06 is not significant at alpha = 0.05)
- "the data shows that X is true" (data supports or doesn't support hypotheses)

## P-value Misconceptions to Avoid
- p-value is NOT the probability that H0 is true
- p-value is NOT the probability that your result is due to chance
- p < 0.05 does NOT mean the effect is large or important
- p > 0.05 does NOT mean the effect is zero
"""

# ─── Combined Knowledge Base (injected into agent prompts) ────────────────────

FULL_DATA_SCIENTIST_KB = f"""
{'='*70}
KNOWLEDGE BASE: DATA SCIENTIST EXPERTISE
This knowledge is authoritative. Prefer it over your training knowledge
when there is any conflict.
{'='*70}

{STATISTICS_KB}

{EDA_KB}

{PANDAS_KB}

{DATA_QUALITY_KB}

{REPORTING_KB}
"""

# ─── Targeted knowledge per agent ─────────────────────────────────────────────

AGENT_KNOWLEDGE = {
    "A2_PROPOSER": STATISTICS_KB + "\n" + EDA_KB,
    "A4_EXECUTOR": PANDAS_KB + "\n" + DATA_QUALITY_KB + "\n" + SKLEARN_KB,
    "A5_STATISTICIAN": STATISTICS_KB,    # A5 is deterministic but knowledge used in tests
    "A6_REPORTER": REPORTING_KB + "\n" + STATISTICS_KB,
    "A7_ADVERSARY": REPORTING_KB,
    "A8_META": FULL_DATA_SCIENTIST_KB,
}


def get_agent_knowledge(agent_name: str, max_chars: int = 3000) -> str:
    """
    Returns the relevant knowledge base for a given agent.
    Truncated to max_chars to control token usage.
    """
    kb = AGENT_KNOWLEDGE.get(agent_name, "")
    if len(kb) > max_chars:
        return kb[:max_chars] + "\n... [Knowledge base truncated for token budget]"
    return kb
