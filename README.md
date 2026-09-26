
# Aerohealth

## Remaining Useful Life Estimation from Aircraft Engine Telemetry

A research prototype for estimating the Remaining Useful Life (RUL) of turbofan engines from multivariate telemetry using machine learning.

---

# 🇬🇧 English

## 1. Project Overview

Aerohealth is a research prototype for **Remaining Useful Life (RUL) estimation** from multivariate aircraft-engine telemetry.

The project applies a reproducible machine-learning pipeline to the **NASA C-MAPSS FD001 Turbofan Engine Degradation Simulation Dataset**.

The objective is to estimate how many operating cycles remain for an engine from its observed degradation history.

Aerohealth is a research prototype. It is **not** certified aviation safety software, production avionics software, a replacement for regulatory maintenance requirements, or a guaranteed failure-prevention system.

---

## 2. Problem

Remaining Useful Life estimation is a central problem in **Prognostics and Health Management (PHM)**.

For each engine, the model observes its operating history and estimates the number of cycles remaining before the end of the recorded useful life.

The final Aerohealth target is:

```text
RUL = final_cycle - current_cycle
````

The model does not use future observations when constructing features for a given cycle.

---

## 3. Dataset

Aerohealth uses the **NASA C-MAPSS FD001** subset.

The dataset contains:

* 100 training engines
* 100 test engines
* 21 sensor channels
* 3 operational settings
* Engine operating cycles

The official test RUL values are provided separately in:

```text
data/raw/RUL_FD001.txt
```

The project uses the actual FD001 dataset for its reported benchmark results.

---

## 4. Data Processing

The raw C-MAPSS data are loaded into structured Pandas DataFrames.

The pipeline:

1. Loads the training, test, and official RUL files.
2. Assigns explicit column names.
3. Sorts observations by engine and cycle.
4. Identifies constant and variable sensors.
5. Engineers causal time-series features.
6. Builds the frozen 78-feature model matrix.
7. Trains and evaluates the machine-learning models.

No future observations are used to construct historical features.

---

## 5. Sensor Analysis

Several sensor channels are constant throughout FD001 and therefore contain no useful variation for the predictive model.

The constant sensors identified in the final pipeline are:

```text
sensor_1
sensor_5
sensor_10
sensor_16
sensor_18
sensor_19
```

The remaining 15 sensors are treated as variable sensors.

`setting_1` and `setting_2` are retained as model inputs.

`setting_3` is constant in FD001 and is not part of the frozen predictive representation.

---

## 6. Feature Engineering

The final predictive representation contains exactly **78 features**.

It consists of:

* 2 operational settings
* 15 raw variable sensors
* 15 five-cycle rolling means
* 15 five-cycle rolling standard deviations
* 15 first differences
* 1 cycle-age feature
* 15 causal ten-cycle trend features

Total:

```text
2 + 15 + 15 + 15 + 15 + 1 + 15 = 78
```

The feature engineering is causal.

For example, the ten-cycle trend is calculated using only observations available up to the current cycle.

The exploratory `relative_life` variable is not used as a predictive feature.

---

## 7. Experimental Design

To evaluate generalization without allowing observations from the same engine to appear in both subsets, the training engines are split at the **engine level**.

The final split is:

```text
80 engines -> training
20 engines -> validation

random_state = 42
```

This avoids row-level leakage between training and validation data.

The official test set remains completely separate from the validation set.

---

## 8. Models

The project evaluates machine-learning approaches for RUL regression.

The final model is a **LightGBM quantile regression model** with:

```text
n_estimators     = 300
num_leaves       = 31
learning_rate    = 0.05
subsample        = 0.8
colsample_bytree = 0.8
objective        = quantile
alpha            = 0.40
random_state     = 42
```

The project also includes an XGBoost baseline for comparison.

---

## 9. Evaluation Metrics

Aerohealth reports three main metrics.

### MAE

Mean Absolute Error measures the average absolute difference between predicted and true RUL.

### RMSE

Root Mean Squared Error gives greater weight to larger prediction errors.

### PHM08 Score

The NASA/PHM08 asymmetric scoring function penalizes early and late predictions differently.

This is relevant to predictive-maintenance evaluation because the direction of an error can have different operational implications.

---

## 10. Validation Results

Using the frozen 78-feature representation and the final LightGBM quantile model:

| Metric |     Validation |
| ------ | -------------: |
| MAE    | 22.5048 cycles |
| RMSE   | 30.3940 cycles |
| PHM08  |     135,081.59 |

These results correspond to the engine-level 80/20 validation split with `random_state = 42`.

---

## 11. Official Test Results

After validation, the final LightGBM model is trained on all available training observations and evaluated against the official FD001 test set and official RUL values.

| Metric | Official FD001 Test |
| ------ | ------------------: |
| MAE    |      16.5170 cycles |
| RMSE   |      22.4028 cycles |
| PHM08  |            1,175.48 |

The prediction range on the official test set is approximately:

```text
3.651 to 159.166 cycles
```

---

## 12. Repository Structure

```text
AEROHEALTH/
|
├── data/
│   └── raw/
│       ├── train_FD001.txt
│       ├── test_FD001.txt
│       └── RUL_FD001.txt
|
├── figures/
│   ├── official_fd001_actual_vs_predicted.svg
│   ├── official_fd001_feature_importance.svg
│   ├── official_fd001_residual_diagnostics.svg
│   ├── official_fd001_test_error_profile.svg
│   ├── quantile_lightgbm_error_profile.svg
│   └── quantile_sensitivity_phm08.svg
|
├── models/
│   └── aerohealth_lgbm_quantile_alpha_040.joblib
|
├── notebooks/
│   └── Aerohealth_Research_Paper.ipynb
|
├── src/
│   ├── data_loader.py
│   ├── features.py
│   ├── model.py
│   ├── evaluation.py
│   └── inference.py
|
├── requirements.txt
└── README.md
```

---

## 13. Installation

Create and activate a Python virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the project dependencies:

```bash
pip install -r requirements.txt
```

---

## 14. Research Notebook

The main research notebook is:

```text
notebooks/Aerohealth_Research_Paper.ipynb
```

It documents the research workflow, including:

* Problem formulation
* Dataset exploration
* Data quality analysis
* Sensor analysis
* Feature engineering
* Experimental design
* Model training
* Validation
* Official test evaluation
* Error analysis
* Sensitivity analysis
* Discussion
* Limitations
* Reproducibility

---

## 15. Running Inference

The trained model can be used through:

```bash
python -m src.inference
```

The inference pipeline:

1. Loads the trained LightGBM model.
2. Loads the FD001 test telemetry.
3. Reconstructs the same causal feature representation.
4. Generates RUL predictions.
5. Selects the latest cycle for each engine.
6. Reports one prediction per test engine.

The inference implementation uses the same frozen 78-feature representation as the training pipeline.

---

## 16. Reproducibility

The project follows several reproducibility principles:

* Fixed random seed: `42`
* Engine-level train/validation split
* Frozen 78-feature representation
* Explicit model configuration
* Explicit evaluation metrics
* Official FD001 test RUL values
* Separate source modules for loading, feature engineering, modeling, evaluation, and inference
* Saved trained model artifact
* Research notebook documenting the experimental workflow

The objective is to make the main experiment inspectable and reproducible using the same dataset and a compatible environment.

---

## 17. Limitations

The C-MAPSS dataset is a simulated turbofan-engine degradation benchmark.

Therefore, performance on FD001 should not be interpreted as evidence of equivalent performance on real aircraft engines.

The project does not provide:

* Certified aviation maintenance decisions
* Real-time aircraft integration
* Regulatory approval
* Guaranteed failure prevention
* Operational deployment validation

Further validation would be required using real-world engine telemetry and domain-specific maintenance constraints.

---

## 18. Technology Stack

The project uses:

* Python
* NumPy
* Pandas
* Scikit-learn
* LightGBM
* XGBoost
* Matplotlib
* Seaborn
* Jupyter

---

## 19. Project Positioning

Aerohealth is designed as a **research-oriented predictive-maintenance prototype** demonstrating how machine learning and time-series feature engineering can be applied to Remaining Useful Life estimation.

The project emphasizes:

**Data -> Features -> Models -> Evaluation -> Evidence**

rather than presenting a model as a standalone prediction system.

---

# 🇫🇷 Français

## 1. Présentation du projet

Aerohealth est un **prototype de recherche** consacré à l'estimation de la **Remaining Useful Life (RUL)**, c'est-à-dire la durée de vie utile restante, à partir de données télémétriques multivariées de moteurs aéronautiques.

Le projet applique une chaîne de traitement reproductible de machine learning au jeu de données **NASA C-MAPSS FD001 Turbofan Engine Degradation Simulation Dataset**.

L'objectif est d'estimer le nombre de cycles de fonctionnement restant avant la fin de la durée de vie utile enregistrée d'un moteur.

Aerohealth est un prototype de recherche. Il ne constitue pas un logiciel certifié de sécurité aéronautique, un logiciel avionique de production, un remplacement des exigences réglementaires de maintenance ou un système garantissant la prévention des pannes.

---

## 2. Problématique

L'estimation de la durée de vie restante constitue un problème central en **Prognostics and Health Management (PHM)**.

Pour chaque moteur, le modèle observe son historique de fonctionnement et estime le nombre de cycles restant avant la fin de sa durée de vie utile enregistrée.

La définition finale de la cible utilisée par Aerohealth est :

```text
RUL = cycle_final - cycle_actuel
```

Le modèle n'utilise pas les observations futures lors de la construction des caractéristiques d'un cycle donné.

---

## 3. Jeu de données

Aerohealth utilise le sous-ensemble **NASA C-MAPSS FD001**.

Le jeu de données contient :

* 100 moteurs d'entraînement
* 100 moteurs de test
* 21 capteurs
* 3 paramètres opérationnels
* Des cycles de fonctionnement

Les valeurs RUL officielles du jeu de test sont fournies séparément dans :

```text
data/raw/RUL_FD001.txt
```

Les résultats présentés dans ce projet utilisent les données FD001 réelles.

---

## 4. Traitement des données

Les données brutes C-MAPSS sont chargées dans des DataFrames Pandas structurés.

La chaîne de traitement :

1. Charge les données d'entraînement, de test et les valeurs RUL officielles.
2. Attribue des noms explicites aux colonnes.
3. Trie les observations par moteur et par cycle.
4. Identifie les capteurs constants et variables.
5. Construit les caractéristiques temporelles causales.
6. Construit la matrice finale de 78 caractéristiques.
7. Entraîne et évalue les modèles de machine learning.

Aucune observation future n'est utilisée pour construire les caractéristiques historiques.

---

## 5. Analyse des capteurs

Plusieurs capteurs sont constants dans FD001 et ne présentent donc aucune variation utile pour le modèle prédictif.

Les capteurs constants identifiés sont :

```text
sensor_1
sensor_5
sensor_10
sensor_16
sensor_18
sensor_19
```

Les 15 autres capteurs sont considérés comme variables.

`setting_1` et `setting_2` sont également conservés comme variables d'entrée du modèle.

`setting_3` est constant dans FD001 et ne fait pas partie de la représentation prédictive finale.

---

## 6. Construction des caractéristiques

La représentation prédictive finale contient exactement **78 caractéristiques**.

Elle comprend :

* 2 paramètres opérationnels
* 15 capteurs variables bruts
* 15 moyennes mobiles sur 5 cycles
* 15 écarts-types mobiles sur 5 cycles
* 15 premières différences
* 1 caractéristique d'âge du cycle
* 15 tendances causales sur 10 cycles

Total :

```text
2 + 15 + 15 + 15 + 15 + 1 + 15 = 78
```

La construction des caractéristiques est causale.

Par exemple, la tendance sur 10 cycles utilise uniquement les observations disponibles jusqu'au cycle courant.

La variable exploratoire `relative_life` n'est pas utilisée comme caractéristique prédictive.

---

## 7. Protocole expérimental

Afin d'évaluer la généralisation sans placer des observations du même moteur dans les deux sous-ensembles, la séparation des données d'entraînement est effectuée **au niveau des moteurs**.

La séparation finale est :

```text
80 moteurs -> entraînement
20 moteurs -> validation

random_state = 42
```

Cette approche évite la fuite de données entre entraînement et validation au niveau des lignes.

Le jeu de test officiel reste complètement séparé de l'ensemble de validation.

---

## 8. Modèles

Le projet évalue des approches de machine learning pour la régression de la RUL.

Le modèle final est un modèle de **régression quantile LightGBM** avec :

```text
n_estimators     = 300
num_leaves       = 31
learning_rate    = 0.05
subsample        = 0.8
colsample_bytree = 0.8
objective        = quantile
alpha            = 0.40
random_state     = 42
```

Le projet contient également une baseline XGBoost pour comparaison.

---

## 9. Métriques d'évaluation

Aerohealth utilise trois métriques principales.

### MAE

L'erreur absolue moyenne mesure l'écart absolu moyen entre la RUL prédite et la RUL réelle.

### RMSE

La racine de l'erreur quadratique moyenne donne davantage de poids aux erreurs importantes.

### Score PHM08

La fonction de score asymétrique NASA/PHM08 pénalise différemment les prédictions trop précoces et trop tardives.

Cette métrique est pertinente pour les applications de maintenance prédictive, car la direction de l'erreur peut avoir des implications opérationnelles différentes.

---

## 10. Résultats de validation

Avec la représentation finale de 78 caractéristiques et le modèle LightGBM quantile :

| Métrique |     Validation |
| -------- | -------------: |
| MAE      | 22.5048 cycles |
| RMSE     | 30.3940 cycles |
| PHM08    |     135 081.59 |

Ces résultats correspondent à la séparation au niveau des moteurs 80/20 avec `random_state = 42`.

---

## 11. Résultats sur le test officiel

Après la validation, le modèle final LightGBM est entraîné sur l'ensemble des observations d'entraînement disponibles, puis évalué sur le jeu de test officiel FD001 et ses valeurs RUL officielles.

| Métrique | Test officiel FD001 |
| -------- | ------------------: |
| MAE      |      16.5170 cycles |
| RMSE     |      22.4028 cycles |
| PHM08    |            1 175.48 |

L'intervalle des prédictions sur le jeu de test officiel est approximativement :

```text
3.651 à 159.166 cycles
```

---

## 12. Notebook de recherche

Le notebook principal est :

```text
notebooks/Aerohealth_Research_Paper.ipynb
```

Il documente notamment :

* La formulation du problème
* L'exploration des données
* L'analyse de la qualité des données
* L'analyse des capteurs
* La construction des caractéristiques
* Le protocole expérimental
* L'entraînement des modèles
* La validation
* L'évaluation sur le test officiel
* L'analyse des erreurs
* L'analyse de sensibilité
* La discussion
* Les limites
* La reproductibilité

---

## 13. Inférence

Le modèle entraîné peut être utilisé avec :

```bash
python -m src.inference
```

Le pipeline d'inférence :

1. Charge le modèle LightGBM entraîné.
2. Charge la télémétrie FD001 de test.
3. Reconstruit les mêmes caractéristiques causales.
4. Génère les prédictions RUL.
5. Sélectionne le dernier cycle de chaque moteur.
6. Produit une prédiction par moteur de test.

Le pipeline d'inférence utilise exactement la même représentation de 78 caractéristiques que le pipeline d'entraînement.

---

## 14. Reproductibilité

Le projet suit plusieurs principes de reproductibilité :

* Graine aléatoire fixe : `42`
* Séparation entraînement/validation au niveau des moteurs
* Représentation figée de 78 caractéristiques
* Configuration explicite du modèle
* Métriques d'évaluation explicites
* Valeurs RUL officielles FD001
* Modules séparés pour le chargement, les caractéristiques, le modèle, l'évaluation et l'inférence
* Modèle entraîné sauvegardé
* Notebook de recherche documentant le workflow expérimental

L'objectif est de permettre à un autre chercheur d'inspecter la méthodologie et de reproduire l'expérience principale avec les mêmes données et un environnement compatible.

---

## 15. Limites

Le jeu de données C-MAPSS est un benchmark simulé de dégradation de moteurs turbofan.

Les performances obtenues sur FD001 ne doivent donc pas être interprétées comme une preuve de performances équivalentes sur des moteurs aéronautiques réels.

Le projet ne fournit pas :

* De décisions de maintenance aéronautique certifiées
* D'intégration temps réel avec un aéronef
* D'approbation réglementaire
* De garantie de prévention des pannes
* De validation opérationnelle en environnement réel

Une validation supplémentaire serait nécessaire avec des données télémétriques réelles et des contraintes de maintenance propres au domaine aéronautique.

---

## 16. Technologies

Le projet utilise :

* Python
* NumPy
* Pandas
* Scikit-learn
* LightGBM
* XGBoost
* Matplotlib
* Seaborn
* Jupyter

---

## 17. Positionnement du projet

Aerohealth est conçu comme un **prototype de recherche en maintenance prédictive** démontrant comment le machine learning et l'ingénierie des caractéristiques temporelles peuvent être appliqués à l'estimation de la durée de vie utile restante.

Le projet met l'accent sur :

**Données -> Caractéristiques -> Modèles -> Évaluation -> Preuves**

plutôt que de présenter un modèle comme un système de prédiction autonome.

---

## Licence et citation

Ce dépôt est un projet éducatif et de recherche développé dans le cadre de l'initiative Aerohealth.

Toute réutilisation, modification ou extension du projet doit préserver l'attribution du projet et citer correctement le jeu de données NASA C-MAPSS utilisé.

---

**Aerohealth.ai**

*Predictive Maintenance Intelligence through Machine Learning*


